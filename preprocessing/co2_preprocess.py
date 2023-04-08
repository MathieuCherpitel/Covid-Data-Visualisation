import pandas as pd
import json


def main():
    df = pd.read_csv('../data/food_production.csv')
    new_df = df[['Food product', 'Animal Feed', 'Packging', 'Processing', 'Retail', 'Transport']]
    renamed_df = new_df.rename(columns={'Food product': 'Product', 'Animal Feed': 'Feed animals', 'Packging': 'Packaging'})
    formated_data = []
    for column_name in renamed_df.columns[1:]:
        col = renamed_df[column_name]
        childrens = []
        for _, row in renamed_df.iterrows():
            if row[column_name] > 0:
                childrens.append({
                    "name": row['Product'],
                    "value": row[column_name]
                })
        formated_data.append({
            "name": column_name,
            "value": col.sum(),
            "childrens": sorted(childrens, key=lambda d: d['value'], reverse=True)
        })
    with open("../data/hierarchy_co2_emission.json", "w") as final:
        json.dump(sorted(formated_data, key=lambda d: d['value'], reverse=True), final, indent=4)


if __name__ == "__main__":
    main()
