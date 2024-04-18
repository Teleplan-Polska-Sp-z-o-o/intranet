enum Endpoints {
  User = "/api/user/one",
  Users = "/api/user/all",
  UserAuth = "/api/user/auth",
  UserSettingsTheme = "/api/user/settings/theme",
  UserSettingsLanguage = "/api/user/settings/language",
  UserPermission = "/api/user/permission",

  // documents
  ViewDocument = "/uploads",
  Document = "/api/document",
  DocumentDepartment = "/api/document/department",
  DocumentCategory = "/api/document/category",
  DocumentSubcategory = "/api/document/subcategory",

  // editor
  News = "/api/editor/news",

  // change
  ChangeRequest = "/api/change/request",

  //notification
  Notification = "/api/notification",
}

export { Endpoints };
