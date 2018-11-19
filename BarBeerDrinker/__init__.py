from flask import Flask, render_template
from flask import jsonify
from flask import make_response
from flask import request


import json

from BarBeerDrinker import database

app = Flask(__name__)


@app.route('/api/bar', methods=["GET"])
def get_bars():
    return jsonify(database.get_bars())


@app.route("/api/bar/<name>", methods=["GET"])
def find_bar(name):
    try:
        if name is None:
            raise ValueError("Bar is not specified.")
        bar = database.find_bar(name)
        if bar is None:
            return make_response("No bar found with the given name.", 404)
        return jsonify(bar)
    except ValueError as e:
        return make_response(str(e), 400)
    except Exception as e:
        return make_response(str(e), 500)


@app.route("/api/beers_cheaper_than", methods=["POST"])
def find_beers_cheaper_than():
    body = json.loads(request.data)
    max_price = body['maxPrice']
    return jsonify(database.filter_beers(max_price))


@app.route('/api/menu/<name>', methods=['GET'])
def get_menu(name):
    try:
        if name is None:
            raise ValueError('Bar is not specified.')
        bar = database.find_bar(name)
        if bar is None:
            return make_response("No bar found with the given name.", 404)
        return jsonify(database.get_bar_menu(name))
    except ValueError as e:
        return make_response(str(e), 400)
    except Exception as e:
        return make_response(str(e), 500)


@app.route("/api/bar-cities", methods=["GET"])
def get_bar_cities():
    try:
        return jsonify(database.get_bar_cities())
    except Exception as e:
        return make_response(str(e), 500)


@app.route("/api/beer", methods=["GET"])
def get_beers():
    try:
        return jsonify(database.get_beers())
    except Exception as e:
        return make_response(str(e), 500)


@app.route("/api/beer-manufacturer", methods=["GET"])
def get_beer_manufacturers():
    try:
        return jsonify(database.get_beer_manufacturers(None))
    except Exception as e:
        return make_response(str(e), 500)


@app.route("/api/beer-manufacturer/<beer>", methods=["GET"])
def get_manufacturers_making(beer):
    try:
        return jsonify(database.get_beer_manufacturers(beer))
    except Exception as e:
        return make_response(str(e), 500)


@app.route("/api/likes/<name>", methods=["GET"])
def get_likes(name):
    try:
        drinker = name
        if drinker is None:
            raise ValueError("Drinker is not specified.")
        return jsonify(database.get_likes(drinker))
    except Exception as e:
        return make_response(str(e), 500)


@app.route("/api/drinker", methods=["GET"])
def get_drinkers():
    try:
        return jsonify(database.get_drinkers())
    except Exception as e:
        return make_response(str(e), 500)


@app.route("/api/drinker/<name>", methods=["GET"])
def get_drinker(name):
    try:
        if name is None:
            raise ValueError("Drinker is not specified.")
        return jsonify(database.get_drinker_info(name))
    except ValueError as e:
        return make_response(str(e), 400)
    except Exception as e:
        return make_response(str(e), 500)


@app.route('/api/bars-selling/<beer>', methods=['GET'])
def find_bars_selling(beer):
    try:
        if beer is None:
            raise ValueError('Beer not specified')
        return jsonify(database.get_bars_selling(beer))
    except ValueError as e:
        return make_response(str(e), 400)
    except Exception as e:
        return make_response(str(e), 500)


@app.route('/api/frequents-data', methods=['GET'])
def get_bar_frequent_counts():
    try:
        return jsonify(database.get_bar_frequent_counts())
    except Exception as e:
        return make_response(str(e), 500)


#Top Ten Spenders
@app.route("/api/bar/<name>/topten", methods=["GET"])
def get_top_ten(name):
    try:
        if name is None:
            raise ValueError('Bar is not specified.')
        bar = database.find_bar(name)
        if bar is None:
            return make_response("No bar found with the given name.", 404)
        return jsonify(database.get_top_spenders(name))
    except ValueError as e:
        return make_response(str(e), 400)
    except Exception as e:
        return make_response(str(e), 500)


#Get Most Popular beers from a bar
@app.route("/api/bar/<name>/topbeers", methods=["GET"])
def get_top_beers(name):
    try:
        if name is None:
            raise ValueError('Bar is not specified.')
        bar = database.find_bar(name)
        if bar is None:
            return make_response("No bar found with the given name.", 404)
        return jsonify(database.beers_by_popularity(name))
    except ValueError as e:
        return make_response(str(e), 400)
    except Exception as e:
        return make_response(str(e), 500)

# Get Most Popular Manufacturers
@app.route("/api/bar/<name>/topmanf", methods=["GET"])
def get_top_manf(name):
    try:
        if name is None:
            raise ValueError('Bar is not specified.')
        bar = database.find_bar(name)
        if bar is None:
            return make_response("No bar found with the given name.", 404)
        return jsonify(database.manufacturers_by_popularity(name))
    except ValueError as e:
        return make_response(str(e), 400)
    except Exception as e:
        return make_response(str(e), 500)

#Sales by time
@app.route("/api/bar/<name>/bytime", methods=["GET"])
def get_sales_by_time(name):
    try:
        if name is None:
            raise ValueError('Bar is not specified.')
        bar = database.find_bar(name)
        if bar is None:
            return make_response("No bar found with the given name.", 404)
        return jsonify(database.sales_by_time(name))
    except ValueError as e:
        return make_response(str(e), 400)
    except Exception as e:
        return make_response(str(e), 500)

#Busiest day of the week
@app.route("/api/bar/<name>/byday", methods=["GET"])
def get_busiest_day(name):
    try:
        if name is None:
            raise ValueError('Bar is not specified.')
        bar = database.find_bar(name)
        if bar is None:
            return make_response("No bar found with the given name.", 404)
        return jsonify(database.busiest_day_of_the_week(name))
    except ValueError as e:
        return make_response(str(e), 400)
    except Exception as e:
        return make_response(str(e), 500)

#Show all Transactions for a Drinker
@app.route("/api/drinker/<name>/drinkertrans", methods=["GET"])
def get_drinker_transactions(name):
    try:
        if name is None:
            raise ValueError('Drinker is not specified.')
        drinker = database.get_drinker_info(name)
        if drinker is None:
            return make_response("No Drinker found with the given name.", 404)
        return jsonify(database.drinker_transactions(name))
    except ValueError as e:
        return make_response(str(e), 400)
    except Exception as e:
        return make_response(str(e), 500)

#Show Bar graphs of beers they order most
@app.route("/api/drinker/<name>/orders", methods=["GET"])
def get_beers_ordered_most(name):
    try:
        if name is None:
            raise ValueError('Drinker is not specified.')
        drinker = database.get_drinker_info(name)
        if drinker is None:
            return make_response("No Drinker found with the given name.", 404)
        return jsonify(database.most_ordered_beers(name))
    except ValueError as e:
        return make_response(str(e), 400)
    except Exception as e:
        return make_response(str(e), 500)

# 3.Drinkers spending in different bars, on different dates/weeks/months
@app.route("/api/drinker/<name>/bydates", methods=["GET"])
def get_spending_by_bar(name):
    try:
        if name is None:
            raise ValueError('Drinker is not specified.')
        drinker = database.get_drinker_info(name)
        if drinker is None:
            return make_response("No Drinker found with the given name.", 404)
        return jsonify(database.spending_by_bar(name))
    except ValueError as e:
        return make_response(str(e), 400)
    except Exception as e:
        return make_response(str(e), 500)


#Show top 10 places where beer sells the most
@app.route('/api/beerq/<beer>/topbars', methods=['GET'])
def get_top_bars_by_beer(beer):
    try:
        if beer is None:
            raise ValueError('Beer not specified')
        return jsonify(database.top_bars_by_beer(beer))
    except ValueError as e:
        return make_response(str(e), 400)
    except Exception as e:
        return make_response(str(e), 500)

#show also drinkers who are the biggest consumers of this beer
@app.route('/api/beerq/<beer>/consumers', methods=['GET'])
def get_top_consumers(beer):
    try:
        if beer is None:
            raise ValueError('Beer not specified')
        return jsonify(database.biggest_consumers(beer))
    except ValueError as e:
        return make_response(str(e), 400)
    except Exception as e:
        return make_response(str(e), 500)

# time distribution of when this beer sells the most.
@app.route('/api/beerq/<beer>/bytime', methods=['GET'])
def get_beer_by_time(beer):
    try:
        if beer is None:
            raise ValueError('Beer not specified')
        return jsonify(database.beer_sales_by_time(beer))
    except ValueError as e:
        return make_response(str(e), 400)
    except Exception as e:
        return make_response(str(e), 500)




