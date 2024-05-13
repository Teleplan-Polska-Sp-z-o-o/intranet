enum Endpoints {
  Users = "/api/user",

  User = "/api/user/one",
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
  Request = "/api/editor/request",

  // change
  ChangeRequest = "/api/change/request",
  ChangeNotice = "/api/change/notice",

  //notification
  Notification = "/api/notification",
}

export { Endpoints };
