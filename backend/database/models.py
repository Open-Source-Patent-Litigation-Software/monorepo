from os import environ
from dotenv import load_dotenv
from sqlalchemy import (
    create_engine,
    Column,
    ForeignKey,
    Integer,
    String,
    DateTime,
    func,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship, declarative_base, sessionmaker

Base = declarative_base()
load_dotenv()
EXPERIMENTAL_CONNECTION_STRING = environ.get("EXPERIMENTAL_CONNECTION_STRING")


class LoginCredential(Base):
    __tablename__ = "login_credential"
    __table_args__ = {"schema": "public"}
    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    token = Column(String, nullable=False)
    login_provider = Column(String, nullable=False)


class UserPayment(Base):
    __tablename__ = "user_payment"
    __table_args__ = {"schema": "public"}
    id = Column(Integer, primary_key=True, autoincrement=True)
    payment_method = Column(String, nullable=False)
    payment_token = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), nullable=False)


class OrganizationPayment(Base):
    __tablename__ = "organization_payment"
    __table_args__ = {"schema": "public"}
    id = Column(Integer, primary_key=True, autoincrement=True)
    payment_method = Column(String, nullable=False)
    payment_token = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), nullable=False)


class RegUser(Base):
    __tablename__ = "reg_user"
    __table_args__ = {"schema": "public"}
    id = Column(Integer, primary_key=True, autoincrement=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    phone = Column(String)
    payment_id = Column(Integer, ForeignKey("public.user_payment.id"))
    login_credential_id = Column(
        Integer, ForeignKey("public.login_credential.id"), nullable=False
    )
    payment = relationship("UserPayment", backref="users")
    login_credential = relationship("LoginCredential", backref="users")


class Organization(Base):
    __tablename__ = "organization"
    __table_args__ = {"schema": "public"}
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    phone = Column(String)
    features = Column(String)
    payment_id = Column(Integer, ForeignKey("public.organization_payment.id"))
    payment = relationship("OrganizationPayment", backref="organizations")


class OrganizationUser(Base):
    __tablename__ = "organization_user"
    __table_args__ = {"schema": "public"}
    organization_id = Column(
        Integer,
        ForeignKey("public.organization.id", ondelete="CASCADE"),
        primary_key=True,
    )
    user_id = Column(
        Integer, ForeignKey("public.reg_user.id", ondelete="CASCADE"), primary_key=True
    )
    organization = relationship("Organization", backref="organization_users")
    user = relationship("RegUser", backref="organization_users")


class Folder(Base):
    __tablename__ = "folder"
    __table_args__ = {"schema": "public"}
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    description = Column(String)
    organization_id = Column(
        Integer,
        ForeignKey("public.organization.id", ondelete="CASCADE"),
        nullable=False,
    )
    user_id = Column(
        Integer, ForeignKey("public.reg_user.id", ondelete="CASCADE"), nullable=False
    )
    parent_folder_id = Column(
        Integer, ForeignKey("public.folder.id", ondelete="CASCADE")
    )
    organization = relationship("Organization", backref="folders")
    user = relationship("RegUser", backref="folders")
    parent_folder = relationship("Folder", remote_side=[id], backref="subfolders")


class Waitlist(Base):
    __tablename__ = "waitlist"
    __table_args__ = {"schema": "public"}
    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), unique=True, nullable=False)
    phone_number = Column(String)


class OrganizationOwner(Base):
    __tablename__ = "organization_owner"
    __table_args__ = {"schema": "public"}
    organization_id = Column(
        Integer,
        ForeignKey("public.organization.id", ondelete="CASCADE"),
        primary_key=True,
    )
    user_id = Column(
        Integer, ForeignKey("public.reg_user.id", ondelete="CASCADE"), primary_key=True
    )
    organization = relationship("Organization", backref="owners")
    user = relationship("RegUser", backref="owned_organizations")


class OrganizationAdmin(Base):
    __tablename__ = "organization_admin"
    __table_args__ = {"schema": "public"}
    organization_id = Column(
        Integer,
        ForeignKey("public.organization.id", ondelete="CASCADE"),
        primary_key=True,
    )
    user_id = Column(
        Integer, ForeignKey("public.reg_user.id", ondelete="CASCADE"), primary_key=True
    )
    organization = relationship("Organization", backref="admins")
    user = relationship("RegUser", backref="admin_organizations")


class Patent(Base):
    __tablename__ = "patent"
    __table_args__ = {"schema": "public"}
    id = Column(Integer, primary_key=True, autoincrement=True)
    pqai_id = Column(String, nullable=False)
    name = Column(String, nullable=False)
    folder_id = Column(Integer, ForeignKey("public.folder.id", ondelete="CASCADE"))
    description = Column(String)
    organization_id = Column(
        Integer,
        ForeignKey("public.organization.id", ondelete="CASCADE"),
        nullable=False,
    )
    user_id = Column(
        Integer, ForeignKey("public.reg_user.id", ondelete="CASCADE"), nullable=False
    )
    google_patents_link = Column(String)
    folder = relationship("Folder", backref="patents")
    organization = relationship("Organization", backref="patents")
    user = relationship("RegUser", backref="patents")


class Search(Base):
    __tablename__ = "search"
    __table_args__ = {"schema": "public"}
    id = Column(Integer, primary_key=True, autoincrement=True)
    organization_id = Column(
        Integer,
        ForeignKey("public.organization.id", ondelete="CASCADE"),
        nullable=False,
    )
    user_id = Column(
        Integer, ForeignKey("public.reg_user.id", ondelete="CASCADE"), nullable=False
    )
    query = Column(String, nullable=False)
    time = Column(DateTime, server_default=func.now(), nullable=False)
    organization = relationship("Organization", backref="searches")
    user = relationship("RegUser", backref="searches")


class Metric(Base):
    __tablename__ = "metric"
    __table_args__ = {"schema": "public"}
    id = Column(Integer, primary_key=True, autoincrement=True)
    search_id = Column(
        Integer, ForeignKey("public.search.id", ondelete="CASCADE"), nullable=False
    )
    metric_description = Column(String, nullable=False)
    search = relationship("Search", backref="metrics")


class SpecificPatentMetric(Base):
    __tablename__ = "specific_patent_metric"
    __table_args__ = (
        UniqueConstraint("search_id", "patent_id", "metric_id"),
        {"schema": "public"},
    )
    id = Column(Integer, primary_key=True, autoincrement=True)
    search_id = Column(
        Integer, ForeignKey("public.search.id", ondelete="CASCADE"), nullable=False
    )
    patent_id = Column(
        Integer, ForeignKey("public.patent.id", ondelete="CASCADE"), nullable=False
    )
    metric_id = Column(
        Integer, ForeignKey("public.metric.id", ondelete="CASCADE"), nullable=False
    )
    percentage = Column(Integer, nullable=False)
    information = Column(String)
    search = relationship("Search", backref="specific_patent_metrics")
    patent = relationship("Patent", backref="specific_patent_metrics")
    metric = relationship("Metric", backref="specific_patent_metrics")


class ContactQuery(Base):
    __tablename__ = "contact_query"
    __table_args__ = {"schema": "public"}
    id = Column(Integer, primary_key=True, autoincrement=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    message = Column(String, nullable=False)


class OrganizationUserSearchCount(Base):
    __tablename__ = "organization_user_search_count"
    __table_args__ = {"schema": "public"}
    organization_id = Column(
        Integer,
        ForeignKey("public.organization.id", ondelete="CASCADE"),
        primary_key=True,
    )
    user_id = Column(
        Integer, ForeignKey("public.reg_user.id", ondelete="CASCADE"), primary_key=True
    )
    search_count = Column(Integer, default=0, nullable=False)
    organization = relationship("Organization", backref="user_search_counts")
    user = relationship("RegUser", backref="organization_search_counts")


class UserOrganizationSearchCount(Base):
    __tablename__ = "user_organization_search_count"
    __table_args__ = {"schema": "public"}
    organization_id = Column(
        Integer,
        ForeignKey("public.organization.id", ondelete="CASCADE"),
        primary_key=True,
    )
    user_id = Column(
        Integer, ForeignKey("public.reg_user.id", ondelete="CASCADE"), primary_key=True
    )
    search_count = Column(Integer, default=0, nullable=False)
    timespan_start = Column(DateTime, nullable=False, primary_key=True)
    timespan_end = Column(DateTime, nullable=False, primary_key=True)
    organization = relationship(
        "Organization", backref="user_organization_search_counts"
    )
    user = relationship("RegUser", backref="organization_user_search_counts")


class SearchAnalytics(Base):
    __tablename__ = "search_analytics"
    __table_args__ = {"schema": "public"}
    id = Column(Integer, primary_key=True, autoincrement=True)
    organization_id = Column(
        Integer,
        ForeignKey("public.organization.id", ondelete="CASCADE"),
        nullable=False,
    )
    user_id = Column(
        Integer, ForeignKey("public.reg_user.id", ondelete="CASCADE"), nullable=False
    )
    search_id = Column(
        Integer, ForeignKey("public.search.id", ondelete="CASCADE"), nullable=False
    )
    search_time = Column(DateTime, server_default=func.now(), nullable=False)
    organization = relationship("Organization", backref="search_analytics")
    user = relationship("RegUser", backref="search_analytics")
    search = relationship("Search", backref="analytics")


# Set up the database connection and create all tables
engine = create_engine(EXPERIMENTAL_CONNECTION_STRING)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Uncomment the line below to create all tables
# Base.metadata.create_all(engine, checkfirst=True)
