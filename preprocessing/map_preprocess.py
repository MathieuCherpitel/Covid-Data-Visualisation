import pandas as pd
import json


def main():
    df = pd.read_csv('../data/co2_emission.csv').groupby("Entity").last().reset_index()
    df.rename(columns={'Annual CO₂ emissions (tonnes )': "Emissions"}, inplace=True)
    df.to_csv("../data/map_data.csv", index=False)

if __name__ == "__main__":
    main()
