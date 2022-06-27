#!/usr/bin/env python3
from __future__ import annotations
from flask import Flask, request
import torch, os, sys, math, json, random, shutil

MODEL_DIR_NAME = "SRAE_model"
sys.path.insert(1, '../'+MODEL_DIR_NAME+'/')
# sys.path.insert(1, '../sustenaibility_machine_learning/')
from srae import SRAE

from build_model import create_template, train_template
if torch.cuda.is_available():
    print("USING CUDA")
    device = torch.device("cuda:0")
else:
    torch.device("cpu")
if not os.path.exists('users'):
    os.makedirs('users')

app = Flask(__name__)


def load_model_from_file(user,name):
    path = os.path.join('users',user,name)
    if not os.path.exists(path):
        return "model "+path+" not exists"
    model = torch.load(path)
    indicator = len(model['fc0.weight'][0])
    task = len(model['fc1.weight'][0])
    macro = len(model['fc_regressive.weight'][0])

    srae = SRAE(indicator, task, macro)
    srae.load_state_dict(model)
    j_path = path.replace(".pt","")
    srae.load_max_min(j_path)
    return srae


@app.route("/sdi", methods=["GET"])
def eval_sdi():
    with torch.no_grad():
        name = request.json.get('name')
        user = request.json.get('user')
        os.makedirs(os.path.join('users', user), exist_ok=True)
        indicators = request.json.get('indicators')
        srae = load_model_from_file(user,name)
        
        if type(srae) == type(""):
            return srae, 200
        input_norm = torch.tensor([
            list(srae.normalize_json(indicators).values())
        ])[0]
        torch.manual_seed(50)
        output, _, _, _ = srae(input_norm.detach().clone(), None, False, False, True)
        return str(output), 200

@app.route("/predict", methods=["GET"])
def eval_input():
    name = request.json.get('name')
    user = request.json.get('user')
    os.makedirs(os.path.join('users', user), exist_ok=True)
    indicators = request.json.get('indicators')
    sdi = request.json.get('sdi')
    srae = load_model_from_file(user,name)
    if type(srae) == type(""):
        return srae, 200
    nan_index = [index for index, key in enumerate(list(indicators)) if indicators[key] == None or math.isnan(indicators[key])]
    with torch.no_grad():
        input_norm = torch.tensor([
            list(srae.normalize_json(indicators).values())
        ])[0]
        
        if math.isnan(sdi):
            torch.manual_seed(50)
            _, predicted_input, _, _,  = srae(input_norm, None, False, False, True)
        else:
            origin = input_norm.detach().clone()
            real_input = origin.detach().clone()

            output = 2
            i = 0
            min = 2
            while round(abs(sdi - output), 5) >= 0.025:
                

                i+=1
                for ind in nan_index:
                    real_input[ind] = random.uniform(0,1)
                _, predicted_input, _, _,  = srae(real_input, None, False, False, True)
                real_input = origin.detach().clone()
                real_input[nan_index] = predicted_input[nan_index]

                torch.manual_seed(50) 
                output, _, _, _, = srae(real_input.detach().clone(), None, False, False, True)

                if min > round(abs(sdi - output), 6):
                    min = round(abs(sdi - output), 6)
                    min_input = real_input.detach().clone()
                    min_output = output

                if i % 10000 == 9999:
                    
                    input_difference = [round(n, 5) for n in abs(origin - real_input).detach().cpu().numpy().tolist()]

                    print(
                        "At iteration ",i+1,
                        "\n\tand fixed output:",sdi,
                        "\n\tand origin input norm:",origin,
                        "\n\tand new input norm:",real_input,
                        
                        "\n\tinput_difference:",input_difference,
                        "\n\n\tOutput predicted:",output,
                        "\n\tError:",abs(sdi - output)
                    )
                if i > 100000:
                    ae_list = srae.rebuild_input(min_input.detach().clone()).numpy().tolist()
                    ae_dict = dict(zip(indicators.keys(),ae_list))
                    return "Can't predict a right input, please retry. Nearest result: "+json.dumps(ae_dict)+" With output: "+str(round(min_output, 3)), 200        
    ae_list = srae.rebuild_input(real_input.detach().clone()).numpy().tolist()
    ae_dict = dict(zip(indicators.keys(),ae_list))
    ae_dict["sdi"] = output
    print("Sdi predicted:",output,srae.rebuild_input(real_input.detach().clone()).numpy().tolist())
    return json.dumps(ae_dict), 200    

    
@app.route("/retrieve", methods=["GET"])
def retrieve_template():
    name = request.args.get('name')
    user = request.args.get('user')
    os.makedirs(os.path.join('users', user), exist_ok=True)
    srae = load_model_from_file(user,name)
    if type(srae) == type(""):
        return srae, 200
    weight_array = {}
    for name, param in srae.named_parameters():
        if 'weight' in name:
            weight_array[name] = param.detach().clone().numpy().tolist()
    return weight_array, 200

@app.route("/create", methods=["POST"])
def create_template_api():
    name = request.json.get('template').get('name')
    user = request.json.get('template').get('user')

    os.makedirs(os.path.join('users', user), exist_ok=True)
    indicator = request.json.get('indicator')
    task = request.json.get('task')
    macro = request.json.get('macro')
    is_early = request.json.get('is_early')
    output_path = os.path.join(os.getcwd(), 'users', user, name)
    net = create_template(output_path, indicator, task, macro)
    print("Start training")
    train_template(output_path, indicator, task, "imputer", is_early)
    
    shutil.rmtree(os.path.join(output_path, 'years'), ignore_errors=True)
    if os.path.exists(output_path+".pt"):
        return "Net created succesfully.", 200
    else:
        return "Net not created.", 200

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=3001, debug=True)