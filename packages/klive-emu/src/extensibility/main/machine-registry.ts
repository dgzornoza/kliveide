import { registerMachineTypeAction } from "../../shared/state/machines-reducer";
import { mainStore } from "../../main/main-state/main-store";
import { RegisteredMachine } from "../../shared/state/AppState";
import { MachineContextProvider } from "./machine-context";

/**
 * Holds the registry of virtual machine context providers
 */
export const machineRegistry = new Map<string, MachineRegistryInfo>();

/**
 * Get the identifiers of registered machines
 * @returns
 */
export function getRegisteredMachines(): RegisteredMachine[] {
  const result: RegisteredMachine[] = [];
  for (var entry of machineRegistry.values()) {
    if (entry.active ?? true) {
      result.push({
        id: entry.id,
        label: entry.label,
      });
    }
  }
  return result;
}

/**
 * Machine information to use to register the virtual machine types
 */
export type MachineInfo = {
  id: string;
  label: string;
  active?: boolean;
};

/**
 * Registry information about a virtual machine
 */
export type MachineRegistryInfo = MachineInfo & {
  implementor: MachineContextProvider;
};

/**
 * Decorator to annotate a virtual machine context provider
 * @param data Virtual machine information
 */
export function VirtualMachineType(data: MachineInfo) {
  return function <T extends { new (...args: any[]): Record<string, any> }>(
    constructor: T
  ) {
    const info: MachineRegistryInfo = {
      id: data.id,
      label: data.label,
      active: data.active,
      implementor: constructor as unknown as MachineContextProvider,
    };
    machineRegistry.set(data.id, info);
    mainStore.dispatch(
      registerMachineTypeAction({
        id: info.id,
        label: info.label,
      })
    );
  };
}
