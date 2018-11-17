from sqlalchemy import create_engine,sql,select,MetaData,Table,or_

from BarBeerDrinker import config

engine = create_engine(config.database_uri)

def get_bars():
    with engine.connect() as con:
        rs = con.execute("SELECT barname, lic, city, state, phone, address FROM bars;")
        return [dict(row) for row in rs]

def find_bar(name):
    with engine.connect() as con:
        query = sql.text(
            "SELECT barname, lic, city, state, phone, address FROM bars WHERE name = :name;"
        )

        rs = con.execute(query, name=name)
        result = rs.first()
        if result is None:
            return None
        return dict(result)

def filter_beers(max_price):
    with engine.connect() as con:
        query = sql.text(
            "SELECT * FROM sells WHERE price < :max_price;"
        )

        rs = con.execute(query, max_price=max_price)
        results = [dict(row) for row in rs]
        for r in results:
            r['price'] = float(r['price'])
        return results


def get_bar_menu(bar_name):
    with engine.connect() as con:
        query = sql.text(
            'SELECT a.item, a.price, a.manufacturer \
            FROM sells as a \
            WHERE a.barname = :bar\
            ORDER BY manufacturer desc;\
            ')
        rs = con.execute(query, bar=bar_name)
        results = [dict(row) for row in rs]
        for i, _ in enumerate(results):
            results[i]['price'] = float(results[i]['price'])
        return results


def get_bars_selling(beer):
    with engine.connect() as con:
        query = sql.text('SELECT a.barname, a.price\
                FROM sells AS a\
                WHERE a.item = :beer \
                ORDER BY a.price; \
            ')
        rs = con.execute(query, beer=beer)
        results = [dict(row) for row in rs]
        for i, _ in enumerate(results):
            results[i]['price'] = float(results[i]['price'])
        return results


def get_bar_frequent_counts():
    with engine.connect() as con:
        query = sql.text('SELECT Bar, count(*) as frequentCount \
                FROM frequents \
                GROUP BY Bar; \
            ')
        rs = con.execute(query)
        results = [dict(row) for row in rs]
        return results

def get_frequent_bar(drinker):
    with engine.connect() as con:
        query = sql.text('SELECT DISTINCT Bar FROM Frequents where Drinker = :drinker;')
        rs = con.execute(query, drinker=drinker)
        results = [dict(row) for row in rs]
        return results

def get_bar_cities():
    with engine.connect() as con:
        rs = con.execute('SELECT DISTINCT city FROM bars;')
        return [row['city'] for row in rs]


def get_beers():
    """Gets a list of beer names from the beers table."""

    with engine.connect() as con:
        rs = con.execute('SELECT name, manufacturer FROM beers;')
        return [dict(row) for row in rs]


def get_beer_manufacturers(beer):
    with engine.connect() as con:
        if beer is None:
            rs = con.execute('SELECT DISTINCT manufacturer FROM beers;')
            return [row['manf'] for row in rs]

        query = sql.text('SELECT manufacturer FROM beers WHERE name = :beer;')
        rs = con.execute(query, beer=beer)
        result = rs.first()
        if result is None:
            return None
        return result['manf']


def get_drinkers():
    with engine.connect() as con:
        rs = con.execute('SELECT Dname, city, phone, address, User_ID FROM Drinkers;')
        return [dict(row) for row in rs]


def get_likes(drinker_name):
    """Gets a list of beers liked by the drinker provided."""

    with engine.connect() as con:
        query = sql.text('SELECT beer FROM Likes WHERE name = :name;')
        rs = con.execute(query, name=drinker_name)
        return [row['beer'] for row in rs]


def get_drinker_info(drinker_name):
    with engine.connect() as con:
        query = sql.text('SELECT * FROM drinkers WHERE DName = :name;')
        rs = con.execute(query, name=drinker_name)
        result = rs.first()
        if result is None:
            return None
        return dict(result)


def top_10_drinkers(bar_name):
    with engine.connect() as con:
        query = sql.text()
        rs = con.execute(query, bar = bar_name)
        results = [dict(row) for row in rs]
        for r in results:
            r['spent'] = float(r['spent'])
        return results