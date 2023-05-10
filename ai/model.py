import sys
import pickle
import sklearn
import ast
import pandas as pd
import numpy as np
# -----------------
# test = '[[21.060191  , 40.1675071 , 27.8630442 ],[40.880592  , 39.0915106 , 27.746301  ],[31.796282  , 30.330528  , 29.489875  ],[21.3060955 , 38.1191327 , 24.7956367 ],[29.35575688, 37.0293986 , 33.444053  ],[30.36166514, 47.2824775 , 31.9663255 ]]'
test = sys.argv[1]
# -----------------

test = test.replace('\xa0', ' ')
data = ast.literal_eval(test)

# -----------------
pickled_model = pickle.load(open('./ai/model.pkl', 'rb'))
# pickled_model = pickle.load(open('model.pkl', 'rb'))
# -----------------

print(pd.Series(pickled_model.predict(data)).mode().values[0])

sys.stdout.flush()