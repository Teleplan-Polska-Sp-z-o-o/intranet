enum Endpoints {
  uploads = "/uploads",
  documentsFolder = "/documents",
  docxDocumentsFolder = "/docx_documents",

  Users = "/api/user",
  Msal = "/api/msal",

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
  Competence = "/api/competence",

  // editor
  News = "/api/editor/news",
  Request = "/api/editor/request",

  // change
  ChangeRequest = "/api/change/request",
  ChangeNotice = "/api/change/notice",
  ChangeDocument = "/api/dc",

  //notification
  Notification = "/api/notification",

  // server config
  ServerConfig = "/api/server",
}

export { Endpoints };
