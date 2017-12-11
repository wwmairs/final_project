import datetime

from flask import current_app

from project.server import db

class Country(db.Model):
    __tablename__ = 'country'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), unique=True, nullable=False)
    population = db.Column(db.Integer)
    gun_deaths = db.Column(db.Integer)
    gun_suicides = db.Column(db.Integer)
    total_suicides = db.Column(db.Integer)
    total_guns = db.Column(db.Integer)

    def __init__(self, name, pop, gun_deaths, gun_suicides, suicides, guns):
        self.name = name
        self.population = pop
        self.gun_deaths = gun_deaths
        self.gun_suicides = gun_suicides
        self.total_suicides = suicides
        self.total_guns = guns

