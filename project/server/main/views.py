from flask import render_template, Blueprint, url_for, redirect
from project.server import db
from project.server.models import Country
import json

main_blueprint = Blueprint('main', __name__,)


@main_blueprint.route('/')
def home():
    return render_template("blocks.html")

@main_blueprint.route('/country_data', methods=['POST', 'GET', 'OPTIONS'])
def get_country_data():
    results = Country.query.with_entities(
        Country.name,
        Country.population,
        Country.gun_deaths,
        Country.gun_suicides,
        Country.total_suicides,
        Country.total_guns).all()

    for result in results:
        print(result)

    return json.dumps({'countries' : results})
