import { getNumericTokenValue, Token, TokenType } from "@abstractions/interactive-command-service";
import {
  ISettingsService,
  SettingLocation,
  SettingsValue,
} from "@abstractions/settings-service";
import { sendFromIdeToEmu } from "@core/messaging/message-sending";
import { GetAppConfigResponse } from "@core/messaging/message-types";
import { getState } from "@core/service-registry";

export const INVALID_KEY = "$InvalidKey$";

/**
 * This class implements the operations to manage user/project level settings
 */
export class IdeSettingsService implements ISettingsService {
  /**
   * Gets the setting with the specified key
   * @param key Setting key
   * @param location Settings location
   * @returns The value of the setting, if defined; otherwise, null
   */
  async getSetting(
    key: string,
    location: SettingLocation
  ): Promise<SettingsValue | null> {
    const keySegments = key.split(".");
    if (keySegments.some((s) => !this.testSettingKey(s))) {
      throw new Error(INVALID_KEY);
    }
    let configObj = await this.getConfiguration(location);
    return configObj.get(key) ?? null;
  }

  /**
   * Saves the specified setting value. If value is undefined, removes the setting value
   * @param key Setting key
   * @param value Value to save
   * @param location Settings location
   */
  async saveSetting(
    key: string,
    value: SettingsValue,
    location: SettingLocation
  ): Promise<void> {
    console.log("Setting value", value);
    const keySegments = key.split(".");
    if (keySegments.some((s) => !this.testSettingKey(s))) {
      throw new Error(INVALID_KEY);
    }
    let origObj = await this.getConfigurationObject(location);
    let configObj: any = origObj;
    let index = 0;
    while (index < keySegments.length) {
      const segment = keySegments[index];
      if (configObj[segment] === undefined) {
        configObj[segment] = {};
      }
      if (index === keySegments.length - 1) {
        // --- We're processing the last segment
        if (value === undefined) {
          delete configObj[segment];
        } else {
          configObj[segment] = value;
        }
      }

      // --- Next segment
      configObj = configObj[segment];
      index++;
    }

    // --- Let's save the configuration object
    const projState = getState().project;
    let isProject = location === "user" ? false : projState?.hasVm ?? false;
    await sendFromIdeToEmu({
      type: "SaveIdeConfig",
      config: origObj,
      toUser: !isProject,
    });
  }

  /**
   * Gets the entire configuration set from the specified location
   * @param location Settings location
   * @returns The configuration set
   */
  async getConfiguration(
    location: SettingLocation
  ): Promise<Map<string, SettingsValue>> {
    const configObj = await this.getConfigurationObject(location);
    const configMap = new Map<string, SettingsValue>();
    addConfigProps(configObj);
    return configMap;

    function addConfigProps(obj: any, prefix: string = "") {
      const type = typeof obj;
      if (
        type === "string" ||
        type === "number" ||
        type === "boolean" ||
        type === "undefined"
      ) {
        configMap.set(prefix, obj);
        return;
      }
      if (obj === null) {
        configMap.set(prefix, obj);
        return;
      }
      if (type !== "object") {
        return;
      }
      for (const propKey in obj) {
        const value = obj[propKey];
        if (value) {
          const newPrefix = prefix ? `${prefix}.${propKey}` : propKey;
          addConfigProps(value, newPrefix);
        }
      }
    }
  }

  /**
   * Gets the entire configuration set from the specified location
   * @param location Settings location
   * @returns The configuration set
   */
  async getConfigurationObject(
    location: SettingLocation
  ): Promise<Record<string, any>> {
    const projState = getState().project;
    let isProject = location === "user" ? false : projState?.hasVm ?? false;
    const response = await sendFromIdeToEmu<GetAppConfigResponse>({
      type: "GetAppConfig",
      fromUser: !isProject,
    });
    return response.config.ide ?? {};
  }

  /**
   * Tests if a key contains valid characters
   * @param key Key to test
   */
  testSettingKey(key: string): boolean {
    return /[a-zA-Z0-9_$-]+/g.test(key);
  }
}

/**
 * Retrieves the value of the specified token
 * @param token Token to parse
 * @returns Yoken value
 */
export function retrieveTokenValue(token: Token): SettingsValue {
  switch (token.type) {
    case TokenType.BinaryLiteral:
    case TokenType.DecimalLiteral:
    case TokenType.HexadecimalLiteral:
      return getNumericTokenValue(token);
    case TokenType.String:
      return token.text.substr(1, token.text.length - 2);
    default:
      if (token.text === "!true") {
        return true;
      }
      if (token.text === "!false") {
        return false;
      }
      return token.text;
  }
}
