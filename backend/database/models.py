from sqlalchemy import (
    create_engine,
    Column,
    ForeignKey,
    Integer,
    String,
    Text,
    DateTime,
    func,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


class UserPayment(Base):
    __tablename__ = "user_payment"

    id = Column(
        UUID(as_uuid=True), primary_key=True, server_default=func.uuid_generate_v4()
    )
    payment_method = Column(String, nullable=False)
    payment_token = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), nullable=False)


class OrganizationPayment(Base):
    __tablename__ = "organization_payment"

    id = Column(
        UUID(as_uuid=True), primary_key=True, server_default=func.uuid_generate_v4()
    )
    payment_method = Column(String, nullable=False)
    payment_token = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), nullable=False)


class RegUser(Base):
    __tablename__ = "reg_user"

    id = Column(
        UUID(as_uuid=True), primary_key=True, server_default=func.uuid_generate_v4()
    )
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    phone = Column(String)
    payment_id = Column(UUID(as_uuid=True), ForeignKey("user_payment.id"))

    payment = relationship("UserPayment", backref="users")


class Organization(Base):
    __tablename__ = "organization"

    id = Column(
        UUID(as_uuid=True), primary_key=True, server_default=func.uuid_generate_v4()
    )
    name = Column(String, nullable=False)
    phone = Column(String)
    features = Column(String)
    payment_id = Column(UUID(as_uuid=True), ForeignKey("organization_payment.id"))

    payment = relationship("OrganizationPayment", backref="organizations")


class OrganizationUser(Base):
    __tablename__ = "organization_user"

    organization_id = Column(
        UUID(as_uuid=True),
        ForeignKey("organization.id", ondelete="CASCADE"),
        primary_key=True,
    )
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("reg_user.id", ondelete="CASCADE"),
        primary_key=True,
    )

    organization = relationship("Organization", backref="organization_users")
    user = relationship("RegUser", backref="organization_users")


class Folder(Base):
    __tablename__ = "folder"

    id = Column(
        UUID(as_uuid=True), primary_key=True, server_default=func.uuid_generate_v4()
    )
    name = Column(String, nullable=False)
    description = Column(String)
    organization_id = Column(
        UUID(as_uuid=True),
        ForeignKey("organization.id", ondelete="CASCADE"),
        nullable=False,
    )
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("reg_user.id", ondelete="CASCADE"),
        nullable=False,
    )
    parent_folder_id = Column(
        UUID(as_uuid=True), ForeignKey("folder.id", ondelete="CASCADE")
    )

    organization = relationship("Organization", backref="folders")
    user = relationship("RegUser", backref="folders")
    parent_folder = relationship("Folder", remote_side=[id], backref="subfolders")


class Waitlist(Base):
    __tablename__ = "waitlist"

    id = Column(
        UUID(as_uuid=True), primary_key=True, server_default=func.uuid_generate_v4()
    )
    email = Column(String(255), unique=True, nullable=False)
    phone_number = Column(String)


class OrganizationOwner(Base):
    __tablename__ = "organization_owner"

    organization_id = Column(
        UUID(as_uuid=True),
        ForeignKey("organization.id", ondelete="CASCADE"),
        primary_key=True,
    )
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("reg_user.id", ondelete="CASCADE"),
        primary_key=True,
    )

    organization = relationship("Organization", backref="owners")
    user = relationship("RegUser", backref="owned_organizations")


class OrganizationAdmin(Base):
    __tablename__ = "organization_admin"

    organization_id = Column(
        UUID(as_uuid=True),
        ForeignKey("organization.id", ondelete="CASCADE"),
        primary_key=True,
    )
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("reg_user.id", ondelete="CASCADE"),
        primary_key=True,
    )

    organization = relationship("Organization", backref="admins")
    user = relationship("RegUser", backref="admin_organizations")


class Patent(Base):
    __tablename__ = "patent"

    id = Column(
        UUID(as_uuid=True), primary_key=True, server_default=func.uuid_generate_v4()
    )
    pqai_id = Column(String, nullable=False)
    name = Column(String, nullable=False)
    folder_id = Column(UUID(as_uuid=True), ForeignKey("folder.id", ondelete="CASCADE"))
    description = Column(String)
    organization_id = Column(
        UUID(as_uuid=True),
        ForeignKey("organization.id", ondelete="CASCADE"),
        nullable=False,
    )
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("reg_user.id", ondelete="CASCADE"),
        nullable=False,
    )
    google_patents_link = Column(String)

    folder = relationship("Folder", backref="patents")
    organization = relationship("Organization", backref="patents")
    user = relationship("RegUser", backref="patents")


class Search(Base):
    __tablename__ = "search"

    id = Column(
        UUID(as_uuid=True), primary_key=True, server_default=func.uuid_generate_v4()
    )
    organization_id = Column(
        UUID(as_uuid=True),
        ForeignKey("organization.id", ondelete="CASCADE"),
        nullable=False,
    )
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("reg_user.id", ondelete="CASCADE"),
        nullable=False,
    )
    query = Column(String, nullable=False)
    time = Column(DateTime, server_default=func.now(), nullable=False)

    organization = relationship("Organization", backref="searches")
    user = relationship("RegUser", backref="searches")


class Metric(Base):
    __tablename__ = "metric"

    id = Column(
        UUID(as_uuid=True), primary_key=True, server_default=func.uuid_generate_v4()
    )
    search_id = Column(
        UUID(as_uuid=True), ForeignKey("search.id", ondelete="CASCADE"), nullable=False
    )
    metric_description = Column(String, nullable=False)

    search = relationship("Search", backref="metrics")


class SpecificPatentMetric(Base):
    __tablename__ = "specific_patent_metric"

    id = Column(
        UUID(as_uuid=True), primary_key=True, server_default=func.uuid_generate_v4()
    )
    search_id = Column(
        UUID(as_uuid=True), ForeignKey("search.id", ondelete="CASCADE"), nullable=False
    )
    patent_id = Column(
        UUID(as_uuid=True), ForeignKey("patent.id", ondelete="CASCADE"), nullable=False
    )
    metric_id = Column(
        UUID(as_uuid=True), ForeignKey("metric.id", ondelete="CASCADE"), nullable=False
    )
    percentage = Column(Integer, nullable=False)
    information = Column(String)

    search = relationship("Search", backref="specific_patent_metrics")
    patent = relationship("Patent", backref="specific_patent_metrics")
    metric = relationship("Metric", backref="specific_patent_metrics")

    __table_args__ = (UniqueConstraint("search_id", "patent_id", "metric_id"),)


class ContactQuery(Base):
    __tablename__ = "contact_query"

    id = Column(
        UUID(as_uuid=True), primary_key=True, server_default=func.uuid_generate_v4()
    )
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    message = Column(String, nullable=False)


class OrganizationUserSearchCount(Base):
    __tablename__ = "organization_user_search_count"

    organization_id = Column(
        UUID(as_uuid=True),
        ForeignKey("organization.id", ondelete="CASCADE"),
        primary_key=True,
    )
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("reg_user.id", ondelete="CASCADE"),
        primary_key=True,
    )
    search_count = Column(Integer, default=0, nullable=False)

    organization = relationship("Organization", backref="user_search_counts")
    user = relationship("RegUser", backref="organization_search_counts")


class UserOrganizationSearchCount(Base):
    __tablename__ = "user_organization_search_count"

    organization_id = Column(
        UUID(as_uuid=True),
        ForeignKey("organization.id", ondelete="CASCADE"),
        primary_key=True,
    )
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("reg_user.id", ondelete="CASCADE"),
        primary_key=True,
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

    id = Column(
        UUID(as_uuid=True), primary_key=True, server_default=func.uuid_generate_v4()
    )
    organization_id = Column(
        UUID(as_uuid=True),
        ForeignKey("organization.id", ondelete="CASCADE"),
        nullable=False,
    )
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("reg_user.id", ondelete="CASCADE"),
        nullable=False,
    )
    search_id = Column(
        UUID(as_uuid=True), ForeignKey("search.id", ondelete="CASCADE"), nullable=False
    )
    search_time = Column(DateTime, server_default=func.now(), nullable=False)

    organization = relationship("Organization", backref="search_analytics")
    user = relationship("RegUser", backref="search_analytics")
    search = relationship("Search", backref="analytics")


# Set up the database connection and create all tables
engine = create_engine(
    "postgresql+psycopg2://dulanyDB_owner:8kghiNrQnw1H@ep-odd-poetry-a43ma4ds.us-east-1.aws.neon.tech/dulanyDB?sslmode=require"
)
Base.metadata.create_all(engine)
