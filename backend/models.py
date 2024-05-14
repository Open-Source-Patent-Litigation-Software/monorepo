from datetime import datetime


class OrganizationPayment:
    def __init__(
        self,
        id,
        organization_id,
        payment_method,
        payment_token,
        expires_at,
        created_at,
        updated_at,
    ):
        self.id = id
        self.organization_id = organization_id
        self.payment_method = payment_method
        self.payment_token = payment_token
        self.expires_at = expires_at
        self.created_at = created_at
        self.updated_at = updated_at


class UserPayment:
    def __init__(
        self,
        id,
        user_id,
        payment_method,
        payment_token,
        expires_at,
        created_at,
        updated_at,
    ):
        self.id = id
        self.user_id = user_id
        self.payment_method = payment_method
        self.payment_token = payment_token
        self.expires_at = expires_at
        self.created_at = created_at
        self.updated_at = updated_at


class Organization:
    def __init__(self, id, name, phone, features, payment_id):
        self.id = id
        self.name = name
        self.phone = phone
        self.features = features
        self.payment_id = payment_id


class OrganizationOwner:
    def __init__(self, organization_id, user_id):
        self.organization_id = organization_id
        self.user_id = user_id


class OrganizationAdmin:
    def __init__(self, organization_id, user_id):
        self.organization_id = organization_id
        self.user_id = user_id


class OrganizationUser:
    def __init__(self, organization_id, user_id):
        self.organization_id = organization_id
        self.user_id = user_id


class User:
    def __init__(
        self,
        id,
        first_name,
        last_name,
        email,
        password,
        phone,
        organization_id,
        payment_id,
    ):
        self.id = id
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.password = password
        self.phone = phone
        self.organization_id = organization_id
        self.payment_id = payment_id


class Patent:
    def __init__(
        self,
        id,
        pqai_id,
        name,
        folder_id,
        description,
        organization_id,
        google_patents_link,
    ):
        self.id = id
        self.pqai_id = pqai_id
        self.name = name
        self.folder_id = folder_id
        self.description = description
        self.organization_id = organization_id
        self.google_patents_link = google_patents_link


class PatentReadPermission:
    def __init__(self, patent_id, user_id):
        self.patent_id = patent_id
        self.user_id = user_id


class PatentWritePermission:
    def __init__(self, patent_id, user_id):
        self.patent_id = patent_id
        self.user_id = user_id


class Folder:
    def __init__(self, id, name, description, organization_id, parent_folder_id):
        self.id = id
        self.name = name
        self.description = description
        self.organization_id = organization_id
        self.parent_folder_id = parent_folder_id


class FolderUser:
    def __init__(self, folder_id, user_id):
        self.folder_id = folder_id
        self.user_id = user_id


class FolderPatent:
    def __init__(self, folder_id, patent_id):
        self.folder_id = folder_id
        self.patent_id = patent_id


class FolderReadPermission:
    def __init__(self, folder_id, user_id):
        self.folder_id = folder_id
        self.user_id = user_id


class FolderWritePermission:
    def __init__(self, folder_id, user_id):
        self.folder_id = folder_id
        self.user_id = user_id


class Search:
    def __init__(self, id, user_id, query, time):
        self.id = id
        self.user_id = user_id
        self.query = query
        self.time = time


class Metric:
    def __init__(self, id, search_id, patent_id, sentence, match_percentage):
        self.id = id
        self.search_id = search_id
        self.patent_id = patent_id
        self.sentence = sentence
        self.match_percentage = match_percentage


class UserSearchCount:
    def __init__(self, user_id, search_count):
        self.user_id = user_id
        self.search_count = search_count


class SearchAnalytics:
    def __init__(self, id, user_id, search_id, search_time):
        self.id = id
        self.user_id = user_id
        self.search_id = search_id
        self.search_time = search_time
