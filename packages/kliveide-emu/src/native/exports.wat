;; ==========================================================================
;; Exported function

;; CPU API
(export "turnOnCpu" (func $turnOnCpu))
(export "resetCpu" (func $resetCpu))
(export "getCpuState" (func $getCpuState))
(export "updateCpuState" (func $updateCpuState))
(export "enableExtendedInstructions" (func $enableExtendedInstructions))

;; Test Z80 CPU machine exports
(export "prepareTest" (func $prepareTest))
(export "setTestInputLength" (func $setTestInputLength))
(export "getMemLogLength" (func $getMemLogLength))
(export "getIoLogLength" (func $getIoLogLength))
(export "getTbBlueLogLength" (func $getTbBlueLogLength))
(export "runTestCode" (func $runTestCode))
(export "resetMachineType" (func $resetMachineType))

;; ZX Spectrum machine exports
(export "initZxSpectrum" (func $initZxSpectrum))
(export "turnOnMachine" (func $turnOnMachine))
(export "resetMachine" (func $resetMachine))
(export "setUlaIssue" (func $setUlaIssue))
(export "getMachineState" (func $getMachineState))
(export "setExecutionOptions" (func $setExecutionOptions))
(export "executeMachineCycle" (func $executeMachineCycle))
(export "setKeyStatus" (func $setKeyStatus))
(export "getKeyStatus" (func $getKeyStatus))
(export "setPC" (func $setPC))
(export "setInterruptTact" (func $setInterruptTact))
(export "checkForInterrupt" (func $checkForInterrupt))
(export "setBeeperSampleRate" (func $setBeeperSampleRate))
(export "colorize" (func $colorize))
(export "getCursorMode" (func $getCursorMode))
(export "initTape" (func $initTape))
(export "setFastLoad" (func $setFastLoad))
(export "eraseBreakpoints" (func $eraseBreakPoints))
(export "setBreakpoint" (func $setBreakpoint))
(export "removeBreakpoint" (func $removeBreakpoint))
(export "testBreakpoint" (func $testBreakpoint))
(export "resetStepOverStack" (func $resetStepOverStack))
(export "markStepOverStack" (func $markStepOverStack))

