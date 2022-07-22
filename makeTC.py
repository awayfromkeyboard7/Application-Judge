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

        mkdir_command = 'mkdir ' + str(problem['_id'])

        # change current directory and make problemId directory
        os.system(mkdir_command)
        os.chdir(str(problem['_id']))
        os.system('mkdir input')
        os.system('mkdir output')

        examples = problem['examples']
        for idx, example in enumerate(examples):
            os.chdir('input')

            _in = open(f'input{idx+1}.txt', 'w')
            input_text = example['inputText'].split('\\n')
            _in.writelines('\n'.join(input_text))
            _in.close()

            os.chdir('..')
            os.chdir('output')

            _out = open(f'output{idx+1}.txt', 'w')
            output_text = example['outputText'].split('\\n')
            _out.writelines('\n'.join(output_text))
            _out.close()

            os.chdir('..')

        os.chdir('..')


if __name__ == '__main__':
    make_test_case()