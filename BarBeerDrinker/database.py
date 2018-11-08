from sqlalchemy import create_engine, sql

from BarBeerDrinker import config

engine = create_engine(config.database_uri)

def get_bars():
    with engine.connect() as con:
        rs = con.execute("SELECT name, license, city,address, phone FROM BARS;")
        return [dict(row) for row in rs]

def find_bar(name):
    with engine.connect() as con:
        query = sql.text(
            "SELECT name, license, city, address, phone FROM BARS WHERE name = :name;"
        )
        rs = con.execute(query, name=name)
        result = rs.first()
        if result is None:
            return None
        return dict(result)

def filter_beers(max_price):
    with engine.connect() as con:
        query = sql.text(
            "SELECT * FROM Sells WHERE price < :max_price;"
        )

        rs = con.execute(query, max_price=max_price)
        results = [dict(row) for row in rs]
        for r in results:
            r['price'] = float(r['price'])

        return results

def get_bar_menu(bar_name):
    with engine.connect() as con:
        query = sql.text(
            'SELECT a.barname, a.item, a.price, a.manufacturer \
            FROM menu as a \
            WHERE a.bar = :bar;\
            ')
        rs = con.execute(query, bar=bar_name)
        results = [dict(row) for row in rs]
        for i, _ in enumerate(results):
            results[i]['price'] = float(results[i]['price'])
        return results


def get_bars_selling(beer):
    with engine.connect() as con:
        query = sql.text('SELECT a.bar, a.price, b.customers \
                FROM sells AS a \
                JOIN (SELECT bar, count(*) AS customers FROM frequents GROUP BY bar) as b \
                ON a.bar = b.bar \
                WHERE a.beer = :beer \
                ORDER BY a.price; \
            ')
        rs = con.execute(query, beer=beer)
        results = [dict(row) for row in rs]
        for i, _ in enumerate(results):
            results[i]['price'] = float(results[i]['price'])
        return results


def get_bar_frequent_counts():
    with engine.connect() as con:
        query = sql.text('SELECT bar, count(*) as frequentCount \
                FROM frequents \
                GROUP BY bar; \
            ')
        rs = con.execute(query)
        results = [dict(row) for row in rs]
        return results


def get_bar_cities():
    with engine.connect() as con:
        rs = con.execute('SELECT DISTINCT city FROM bars;')
        return [row['city'] for row in rs]


def get_beers():
    """Gets a list of beer names from the beers table."""

    with engine.connect() as con:
        rs = con.execute('SELECT name, manf FROM beers;')
        return [dict(row) for row in rs]


def get_beer_manufacturers(beer):
    with engine.connect() as con:
        if beer is None:
            rs = con.execute('SELECT DISTINCT manf FROM beers;')
            return [row['manf'] for row in rs]

        query = sql.text('SELECT manf FROM beers WHERE name = :beer;')
        rs = con.execute(query, beer=beer)
        result = rs.first()
        if result is None:
            return None
        return result['manf']


def get_drinkers():
    with engine.connect() as con:
        rs = con.execute('SELECT name, city, phone, addr FROM drinkers;')
        return [dict(row) for row in rs]


def get_likes(drinker_name):
    """Gets a list of beers liked by the drinker provided."""

    with engine.connect() as con:
        query = sql.text('SELECT beer FROM likes WHERE drinker = :name;')
        rs = con.execute(query, name=drinker_name)
        return [row['beer'] for row in rs]


def get_drinker_info(drinker_name):
    with engine.connect() as con:
        query = sql.text('SELECT * FROM drinkers WHERE name = :name;')
        rs = con.execute(query, name=drinker_name)
        result = rs.first()
        if result is None:
            return None
        return dict(result)