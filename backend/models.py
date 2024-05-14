# models.py


class OrganizationPayment:
    def __init__(
        self,
        id,
        organization,
        payment_method,
        payment_token,
        expires_at,
        created_at,
        updated_at,
    ):
        self.id = id
        self.organization = organization
        self.payment_method = payment_method
        self.payment_token = payment_token
        self.expires_at = expires_at
        self.created_at = created_at
        self.updated_at = updated_at


class UserPayment:
    def __init__(
        self,
        id,
        user,
        payment_method,
        payment_token,
        expires_at,
        created_at,
        updated_at,
    ):
        self.id = id
        self.user = user
        self.payment_method = payment_method
        self.payment_token = payment_token
        self.expires_at = expires_at
        self.created_at = created_at
        self.updated_at = updated_at


class Organization:
    def __init__(self, id, name, owners, admins, users, phone, features, payment=None):
        self.id = id
        self.name = name
        self.owners = owners
        self.admins = admins
        self.users = users
        self.phone = phone
        self.features = features
        self.payment = payment


class User:
    def __init__(
        self, id, name, email, password, organization, phone=None, payment=None
    ):
        self.id = id
        self.name = name
        self.email = email
        self.password = password
        self.phone = phone
        self.organization = organization
        self.payment = payment


class Case:
    def __init__(
        self,
        id,
        pqai_id,
        name,
        folder,
        description,
        organization,
        googlePatentsLink=None,
        read_permissions=None,
        write_permissions=None,
    ):
        self.id = id
        self.pqaiID = pqai_id
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
    def __init__(
        self,
        id,
        name,
        description,
        organization,
        users,
        cases,
        parent_folder=None,
        subfolders=None,
        read_permissions=None,
        write_permissions=None,
    ):
        self.id = id
        self.name = name
        self.description = description
        self.organization = organization
        self.users = users
        self.cases = cases
        self.parent_folder = parent_folder
        self.subfolders = subfolders if subfolders else []
        self.read_permissions = read_permissions if read_permissions else []
        self.write_permissions = write_permissions if write_permissions else []

    def has_read_permission(self, user):
        if user in self.read_permissions:
            return True
        elif self.parent_folder:
            return self.parent_folder.has_read_permission(user)
        else:
            return False

    def has_write_permission(self, user):
        if user in self.write_permissions:
            return True
        elif self.parent_folder:
            return self.parent_folder.has_write_permission(user)
        else:
            return False
