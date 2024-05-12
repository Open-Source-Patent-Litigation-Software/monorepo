# File for the models of the EasyIP Database

class Organization:
    def __init__(self, id, name, owners, admins, users, phone):
        self.id = id
        self.name = name
        self.owners = owners
        self.admins = admins
        self.users = users
        self.phone = phone

class User:
    def __init__(self, id, name, email, password, organization, phone=None):
        self.id = id
        self.name = name
        self.email = email
        self.password = password
        self.phone = phone
        self.organization = organization

class Case:
    def __init__(
        self,
        id,
        pqaiID,
        name,
        folder,
        description,
        organization,
        client=None,
        googlePatentsLink=None,
        read_permissions=None,
        write_permissions=None
    ):
        self.id = id
        self.pqaiID = pqaiID
        self.name = name
        self.folder = folder
        self.description = description
        self.organization = organization
        self.googlePatentsLink = googlePatentsLink
        self.read_permissions = read_permissions if read_permissions else []
        self.write_permissions = write_permissions if write_permissions else []

    def has_read_permission(self, user):
        return user in self.read_permissions or user in self.folder.read_permissions

    def has_write_permission(self, user):
        return user in self.write_permissions or user in self.folder.write_permissions

class Folder:
    def __init__(self, id, name, description, organization, users, cases, read_permissions=None, write_permissions=None):
        self.id = id
        self.name = name
        self.description = description
        self.organization = organization
        self.users = users
        self.cases = cases
        self.read_permissions = read_permissions if read_permissions else []
        self.write_permissions = write_permissions if write_permissions else []

    def has_read_permission(self, user):
        return user in self.read_permissions

    def has_write_permission(self, user):
        return user in self.write_permissions