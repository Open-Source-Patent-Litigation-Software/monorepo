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
    Table,
    JSON,
    UniqueConstraint,
    MetaData,
)
from sqlalchemy.orm import relationship, declarative_base, sessionmaker

Base = declarative_base()
load_dotenv()
NEON_CONNECTION_STRING = environ.get("NEON_CONNECTION_STRING")


def resetDatabase():
    # Create an engine and metadata
    engine = create_engine(NEON_CONNECTION_STRING)
    metadata = MetaData()

    # Reflect the database
    metadata.reflect(bind=engine)

    # Drop all tables
    metadata.drop_all(bind=engine)


# resetDatabase() # Uncomment this line to reset the database


class RegUser(Base):
    __tablename__ = "reg_user"
    __table_args__ = {"schema": "public"}

    id = Column(String, primary_key=True)  # This will be the Auth0 user ID
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    email = Column(String, nullable=True, unique=True)
    subscription_type = Column(String)


class Organization(Base):
    __tablename__ = "organization"
    __table_args__ = {"schema": "public"}
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    phone = Column(String)
    features = Column(String)


# Many-to-many relationship table for users and organizations
user_organization = Table(
    "user_organization",
    Base.metadata,
    Column("user_id", String, ForeignKey("public.reg_user.id"), primary_key=True),
    Column(
        "organization_id",
        Integer,
        ForeignKey("public.organization.id"),
        primary_key=True,
    ),
    schema="public",
)

RegUser.organizations = relationship(
    "Organization", secondary=user_organization, back_populates="users"
)
Organization.users = relationship(
    "RegUser", secondary=user_organization, back_populates="organizations"
)


class Waitlist(Base):
    __tablename__ = "waitlist"
    __table_args__ = {"schema": "public"}
    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), unique=True, nullable=False)
    phone_number = Column(String)


class ContactQuery(Base):
    __tablename__ = "contact_query"
    __table_args__ = {"schema": "public"}
    id = Column(Integer, primary_key=True, autoincrement=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    message = Column(String, nullable=False)


# Many-to-many relationship table for patents and tags
patent_tag = Table(
    "patent_tag",
    Base.metadata,
    Column(
        "patent_id", Integer, ForeignKey("public.saved_patent.id"), primary_key=True
    ),
    Column("tag_id", Integer, ForeignKey("public.tag.id"), primary_key=True),
    schema="public",
)


class Tag(Base):
    __tablename__ = "tag"
    __table_args__ = {"schema": "public"}
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False, unique=True)


class SavedPatent(Base):
    __tablename__ = "saved_patent"
    __table_args__ = (
        UniqueConstraint("user_id", "organization_id", name="uq_user_org"),
        {"schema": "public"},
    )
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, ForeignKey("public.reg_user.id"), nullable=False)
    organization_id = Column(
        Integer, ForeignKey("public.organization.id"), nullable=True
    )
    patent_data = Column(
        JSON, nullable=False
    )  # Change to String if JSON features are not needed
    saved_on = Column(DateTime, server_default=func.now(), nullable=False)

    user = relationship("RegUser", backref="saved_patents")
    organization = relationship("Organization", backref="saved_patents")
    tags = relationship("Tag", secondary=patent_tag, back_populates="patents")


Tag.patents = relationship("SavedPatent", secondary=patent_tag, back_populates="tags")


# Set up the database connection and create all tables
engine = create_engine(NEON_CONNECTION_STRING)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create all tables
Base.metadata.create_all(engine, checkfirst=True)
