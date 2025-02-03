const actions = {
    toggleSettingsDialog: () => {},
}

export function registerToggleSettingsDialogHandler(fn: () => void){
    actions.toggleSettingsDialog = fn
}

export function unRegisterToggleSettingsDialogHandler(){
   registerToggleSettingsDialogHandler(() => {})
}

export function toggleSettingsDialog(){
    actions.toggleSettingsDialog()
}