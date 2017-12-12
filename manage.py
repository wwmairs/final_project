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
        pop=323100000,
        gun_deaths=33636,
	gun_suicides=21175,
	suicides=44193,
        guns=357000000)
    fronce = Country(
        name='France',
        pop=66900000,
        gun_deaths=1800,
	gun_suicides=1446,
	suicides=9695,
        guns=10000000)
    yermany = Country(
        name='Germany',
        pop=81690000,
        gun_deaths=820,
	gun_suicides=719,
	suicides=44193,
        guns=357000000)
    lawstralia = Country(
        name='Australia',
        pop=323100000,
        gun_deaths=33636,
	gun_suicides=21175,
	suicides=44193,
        guns=357000000)
    canaduh = Country(
        name='Canada',
        pop=323100000,
        gun_deaths=33636,
	gun_suicides=21175,
	suicides=44193,
        guns=357000000)
    angland = Country(
        name='United Kingdom',
        pop=323100000,
        gun_deaths=33636,
	gun_suicides=21175,
	suicides=44193,
        guns=357000000)




    for country in [americuh, fronce, americuss, american, americant, americunt]:
        db.session.add(country)

    db.session.commit()
    
if __name__ == '__main__':
    manager.run()
