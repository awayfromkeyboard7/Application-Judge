from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

mongodb_URI = os.environ.get('MONGO_URL')
db_name = os.environ.get('DB_NAME')
client = MongoClient(mongodb_URI)
db = client[db_name]
problems = db.problems
problem_list = problems.find()


def make_test_case():

    os.chdir('code')
    for problem in problem_list:

        submission_path = 'submission/' + str(problem['_id']) + '/input'
        answer_path = 'answer/' + str(problem['_id']) + '/output'

        # submission folder rwxr-xr-x
        os.makedirs(submission_path, mode=0o755, exist_ok=True)

        # answer folder rwx------
        os.makedirs(answer_path, mode=0o700, exist_ok=True)

        examples = problem['examples']
        for idx, example in enumerate(examples):

            _in = open(f'{submission_path}/input{idx+1}.txt', 'w')
            input_text = example['inputText'].split('\\n')
            _in.writelines('\n'.join(input_text))
            _in.close()

            _out = open(f'{answer_path}/output{idx+1}.txt', 'w')
            output_text = example['outputText'].split('\\n')
            _out.writelines('\n'.join(output_text))
            _out.close()

make_test_case()
