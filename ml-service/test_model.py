import tensorflow as tf
from keras.saving import legacy_h5_format

model = legacy_h5_format.load_model_from_hdf5(
    "model.h5",
    compile=False
)

print("MODEL LOADED SUCCESSFULLY")