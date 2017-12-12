# manage.py

import unittest
import coverage
import pdb

from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
from project.server import create_app, db
from project.server.models import Country

# code coverage
COV = coverage.coverage(
    branch=True,
    include='project/*',
    omit=[
        'project/tests/*',
        'project/server/config.py',
        'project/server/*/__init__.py'
    ]
)
COV.start()

app = create_app()
manager = Manager(app)

@manager.command
def create_db():
    """Creates the db tables."""
    pdb.set_trace()
    db.create_all()

@manager.command
def drop_db():
    """Drops the db tables."""
    db.drop_all()

@manager.command
def create_data():
    americuh = Country(
        name='United States',
        pop=317900000,
        gun_deaths=33636,
	gun_suicides=21175,
	suicides=41149,
        guns=285000000)
    fronce = Country(
        name='France',
        pop=66600000,
        gun_deaths=1856,
	gun_suicides=1335,
	suicides=9695,
        guns=12000000)
    yermany = Country(
        name='Germany',
        pop=81690000,
        gun_deaths=926,
	gun_suicides=719,
	suicides=14517,
        guns=25400000)
    lawstralia = Country(
        name='Australia',
        pop=23790000,
        gun_deaths=211,
	gun_suicides=177,
	suicides=2568,
        guns=3010000)
    canaduh = Country(
        name='Canada',
        pop=35850000,
        gun_deaths=698,
	gun_suicides=518,
	suicides=3726,
        guns=8919328)
    angland = Country(
        name='United Kingdom',
        pop=65130000,
        gun_deaths=144,
	gun_suicides=106,
	suicides=6045,
        guns=2403186)

    for country in [americuh, fronce, yermany, lawstralia, canaduh, angland]:
        db.session.add(country)

    db.session.commit()
    
if __name__ == '__main__':
    manager.run()
