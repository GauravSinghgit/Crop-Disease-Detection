import h5py
import json

def patch_config(obj):

    if isinstance(obj, dict):

        # Fix InputLayer
        if obj.get("class_name") == "InputLayer":

            config = obj.get("config", {})

            config.pop("batch_shape", None)
            config.pop("optional", None)

            if "batch_input_shape" not in config:
                config["batch_input_shape"] = [None, 224, 224, 3]

        # Fix dtype policy
        if "dtype" in obj:

            dtype_val = obj["dtype"]

            if isinstance(dtype_val, dict):

                if dtype_val.get("class_name") == "DTypePolicy":
                    obj["dtype"] = "float32"

        # recurse
        for value in obj.values():
            patch_config(value)

    elif isinstance(obj, list):
        for item in obj:
            patch_config(item)

with h5py.File("model.h5", "r+") as f:

    model_config = json.loads(f.attrs["model_config"])

    patch_config(model_config)

    f.attrs["model_config"] = json.dumps(model_config).encode("utf-8")

print("MODEL PATCHED SUCCESSFULLY")