# API Progress Dashboard

## Table of Contents

- [Global Functions](#global-functions)
- [AI](#ai)
- [BrowserExtension](#browserextension)
- [Clipboard](#clipboard)
- [LocalStorage](#localstorage)
- [WindowManagement](#windowmanagement)
- [Other Exports](#other-exports)

---

## Global Functions

| Method                      | Status               |
|-----------------------------|----------------------|
| captureException            | ❌ Not Implemented    |
| clearSearchBar              | ❌ Not Implemented    |
| closeMainWindow             | ❌ Not Implemented    |
| confirmAlert                | ❌ Not Implemented    |
| getApplications             | ❌ Not Implemented    |
| getDefaultApplication       | ❌ Not Implemented    |
| getFrontmostApplication     | ❌ Not Implemented    |
| getPreferenceValues         | ❌ Not Implemented    |
| getSelectedFinderItems      | ❌ Not Implemented    |
| getSelectedText             | ❌ Not Implemented    |
| launchCommand               | ❌ Not Implemented    |
| open                        | ❌ Not Implemented    |
| openCommandPreferences      | ❌ Not Implemented    |
| openExtensionPreferences    | ❌ Not Implemented    |
| popToRoot                   | ❌ Not Implemented    |
| showHUD                     | ❌ Not Implemented    |
| showInFinder                | ❌ Not Implemented    |
| showToast                   | ❌ Not Implemented    |
| trash                       | ❌ Not Implemented    |
| updateCommandMetadata       | ❌ Not Implemented    |
| useActionPanel              | ❌ Not Implemented    |
| useNavigation               | ❌ Not Implemented    |

## AI

| Method | Status |
|--------|--------|
| ask | ❌ Not Implemented |

## BrowserExtension

| Method | Status |
|--------|--------|
| getContent | ❌ Not Implemented |
| getTabs | ❌ Not Implemented |

## Clipboard

| Method | Status |
|--------|--------|
| copy | ❌ Not Implemented |
| clear | ❌ Not Implemented |
| paste | ❌ Not Implemented |
| read | ❌ Not Implemented |
| readText | ❌ Not Implemented |

## LocalStorage

| Method | Status |
|--------|--------|
| allItems | ❌ Not Implemented |
| getItem | ❌ Not Implemented |
| setItem | ❌ Not Implemented |
| removeItem | ❌ Not Implemented |
| clear | ❌ Not Implemented |

## WindowManagement

| Method | Status |
|--------|--------|
| getDesktops | ❌ Not Implemented |
| getActiveWindow | ❌ Not Implemented |
| getWindowsOnActiveDesktop | ❌ Not Implemented |
| setWindowBounds | ❌ Not Implemented |

## Other Exports

- **Action**
  - **Action.Props**
  - **Action.Style**
  - **Action.CopyToClipboard.Props**
  - **Action.CreateQuicklink.Props**
  - **Action.CreateSnippet.Props**
  - **Action.Open.Props**
  - **Action.OpenInBrowser.Props**
  - **Action.OpenWith.Props**
  - **Action.Paste.Props**
  - **Action.Push.Props**
  - **Action.ShowInFinder.Props**
  - **Action.SubmitForm.Props**
  - **Action.Trash.Props**
  - **Action.ToggleQuickLook.Props**
  - **Action.PickDate.Props**
  - **Action.PickDate.Type**
- **ActionPanel**
  - **ActionPanel.Props**
  - **ActionPanel.Children**
  - **ActionPanel.Section.Props**
  - **ActionPanel.Section.Children**
  - **ActionPanel.Submenu.Props**
  - **ActionPanel.Submenu.Children**
- **ActionPanelChildren**
- **ActionPanelItem**
- **ActionPanelItemProps**
- **ActionPanelProps**
- **ActionPanelSection**
- **ActionPanelSectionChildren**
- **ActionPanelSectionProps**
- **ActionPanelState**
- **ActionPanelSubmenu**
- **ActionPanelSubmenuProps**
- **Alert**
- **AlertActionOptions**
- **AlertActionStyle**
- **AlertOptions**
- **allLocalStorageItems**
- **Application**
- **ArgumentsLaunchProps**
- **Cache**
  - **Cache.Subscriber**
  - **Cache.Subscription**
- **clearClipboard**
- **clearLocalStorage**
- **Color**
  - **Color.ColorLike**
  - **Color.Raw**
- **ColorLike**
- **copyTextToClipboard**
- **CopyToClipboardAction**
- **CopyToClipboardActionProps**
- **Detail**
  - **Detail.Props**
  - **Detail.Metadata.Props**
  - **Detail.Metadata.Label.Props**
  - **Detail.Metadata.Separator.Props**
  - **Detail.Metadata.Link.Props**
  - **Detail.Metadata.TagList.Props**
  - **Detail.Metadata.TagList.Item.Props**
- **DetailProps**
- **DynamicColor**
- **Environment**
- **environment**
- **FileIcon**
- **FileSystemItem**
- **Form**
  - **Form.ItemProps**
  - **Form.Value**
  - **Form.Values**
  - **Form.Props**
  - **Form.ItemReference**
  - **Form.Event**
  - **Form.Event.Type**
  - **Form.TextField**
  - **Form.TextField.Props**
  - **Form.LinkAccessory.Props**
  - **Form.PasswordField**
  - **Form.PasswordField.Props**
  - **Form.TextArea**
  - **Form.TextArea.Props**
  - **Form.Description.Props**
  - **Form.Separator.Props**
  - **Form.Checkbox**
  - **Form.Checkbox.Props**
  - **Form.DatePicker**
  - **Form.DatePicker.Props**
  - **Form.DatePicker.Type**
  - **Form.Dropdown**
  - **Form.Dropdown.Props**
  - **Form.Dropdown.Section.Props**
  - **Form.Dropdown.Item.Props**
  - **Form.TagPicker**
  - **Form.TagPicker.Props**
  - **Form.TagPicker.Item.Props**
  - **Form.FilePicker**
  - **Form.FilePicker.Props**
- **FormCheckbox**
- **FormCheckboxProps**
- **FormDatePicker**
- **FormDatePickerProps**
- **FormDropdown**
- **FormDropdownItem**
- **FormDropdownItemProps**
- **FormDropdownProps**
- **FormDropdownSection**
- **FormDropdownSectionProps**
- **FormItemProps**
- **FormLaunchProps**
- **FormProps**
- **FormSeparator**
- **FormSeparatorProps**
- **FormTagPicker**
- **FormTagPickerItem**
- **FormTagPickerItemProps**
- **FormTagPickerProps**
- **FormTextArea**
- **FormTextAreaProps**
- **FormTextField**
- **FormTextFieldProps**
- **FormValue**
- **FormValues**
- **getLocalStorageItem**
- **Grid**
  - **Grid.Props**
  - **Grid.AspectRatio**
  - **Grid.Inset**
  - **Grid.Fit**
  - **Grid.ItemSize**
  - **Grid.EmptyView.Props**
  - **Grid.Dropdown.Props**
  - **Grid.Dropdown.Item.Props**
  - **Grid.Dropdown.Section.Props**
  - **Grid.Item.Accessory**
  - **Grid.Item.Props**
  - **Grid.Section.Props**
- **Icon**
- **Image**
  - **Image.URL**
  - **Image.Asset**
  - **Image.ImageLike**
  - **Image.Source**
  - **Image.Fallback**
- **ImageLike**
- **ImageMask**
- **ImageSource**
- **Keyboard**
  - **Keyboard.KeyModifier**
  - **Keyboard.KeyEquivalent**
- **KeyboardShortcut**
- **KeyEquivalent**
- **KeyModifier**
- **LaunchProps**
- **LaunchType**
- **List**
  - **List.Props**
  - **List.EmptyView.Props**
  - **List.Dropdown.Props**
  - **List.Dropdown.Item.Props**
  - **List.Dropdown.Section.Props**
  - **List.Item.Accessory**
  - **List.Item.Props**
  - **List.Item.Detail.Props**
  - **List.Item.Detail.Metadata.Props**
  - **List.Item.Detail.Metadata.Label.Props**
  - **List.Item.Detail.Metadata.Separator.Props**
  - **List.Item.Detail.Metadata.Link.Props**
  - **List.Item.Detail.Metadata.TagList.Props**
  - **List.Item.Detail.Metadata.TagList.Item.Props**
  - **List.Section.Props**
- **ListItem**
- **ListItemProps**
- **ListProps**
- **ListSection**
- **ListSectionProps**
- **LocalStorageValue**
- **LocalStorageValues**
- **MenuBarExtra**
  - **MenuBarExtra.Props**
  - **MenuBarExtra.ActionEvent**
  - **MenuBarExtra.Item.Props**
  - **MenuBarExtra.Section.Props**
  - **MenuBarExtra.Submenu.Props**
- **Navigation**
- **OAuth**
- **OpenAction**
- **OpenActionProps**
- **OpenInBrowserAction**
- **OpenInBrowserActionProps**
- **OpenWithAction**
- **OpenWithActionProps**
- **PasteAction**
- **PasteActionProps**
- **pasteText**
- **PopToRootType**
- **Preference**
- **Preferences**
- **preferences**
- **PreferenceValues**
- **PushAction**
- **PushActionProps**
- **randomId**
- **removeLocalStorageItem**
- **render**
- **setLocalStorageItem**
- **ShowInFinderAction**
- **ShowInFinderActionProps**
- **specialKeys**
- **SubmitFormAction**
- **SubmitFormActionProps**
- **Toast**
- **ToastActionOptions**
- **ToastOptions**
- **ToastStyle**
- **Tool**
  - **Tool.Confirmation**
- **TrashAction**
- **TrashActionProps**
- **unstable_AI**
- **useId**
- **useUnstableAI**


---

*Legend:*
- ✅ Done
- 🚧 Work In Progress
- ❌ Not Implemented
