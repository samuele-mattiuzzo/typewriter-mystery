import re
from pathlib import Path
from string import Template

# templates
BASE_TEMPLATE = Path('./index_template.html').read_text()
NAV_SNIPPET = Path('./nav_snippet.html').read_text()
ORIGINAL_SNIPPET = Path('./original_snippet.html').read_text()

BASE_DIR = str(Path().resolve().parent)

PATTERNS_INDEX = Path(BASE_DIR + '/patterns/index.txt').read_text().split('\n')
INDEX_REGEX = '\[([^]]+)\]\(([^)]+)\)'
GENERATED_FNAME = '_index.html'


def load_index():
    # loops through each line, matches the regex and returns a list of {pattern_id, title, pattern_file}
    indexes = []
    re_obj = re.compile(INDEX_REGEX)
    
    for line in PATTERNS_INDEX:
        if line.startswith('-'):
            m = re_obj.search(line)
            title = m.group(1)
            fname = m.group(2)
            obj_id = fname.replace('/patterns/', '').replace('.txt', '')
            
            indexes.append({
                'id': obj_id,
                'title': title,
                'fname': fname
            })
    return indexes


def generate_nav(idx):
    # loops through all the indexes and generates the nav with urls
    # stringtemplate + NAV_SNIPPET fragment replace
    # returns a string
    items = ''
    tpl = Template(NAV_SNIPPET)
    for pattern in idx:
        items += tpl.substitute(
            obj_id = pattern['id'],
            obj_title = pattern['title']
        )
    return items


def generate_content(idx):
    # loops through all the indexes and generates the content
    # use Path to load each file as-is
    # stringtemplate + ORIGINAL_SNIPPET fragment replace
    # returns a string
    items = ''
    tpl = Template(ORIGINAL_SNIPPET)
    for pattern in idx:
        original_content = Path(BASE_DIR + pattern['fname']).read_text()
        items += tpl.substitute(
            obj_id=pattern['id'],
            obj_content=original_content
        )
    return items


def generate_page(nav, ctx):
    # creates a string replacing nav and ctx in BASE_TEMPLATE
    return Template(BASE_TEMPLATE).substitute(
        nav_obj=nav,
        ctx_obj=ctx
    )


def write_to_file(page):
    # writes the generated page to _index.html
    fo = open(GENERATED_FNAME, 'w')
    fo.write(page)
    fo.close()


if __name__ == '__main__':

    # Load indexes, create nav and content and write to file
    idx = load_index()
    nav = generate_nav(idx)
    ctx = generate_content(idx)

    page = generate_page(nav, ctx)

    # write to file _index.html
    write_to_file(page)