# -*- coding: utf-8 -*-
"""
Created on Fri Oct  4 21:18:49 2019

@author: Michi
"""

import glob
import os


# In[]
def find_input_svg_files():
    glob_path = os.path.abspath(os.path.join("img", "icon_*.svg"))
    input_svg_paths = glob.glob(glob_path)
    return [path for path in input_svg_paths if not "colored" in path]


# In[]
def get_new_color_string(new_color):
    new_color_string = "fill:#"
    for component in new_color:
        new_color_string += hex(component)[-2:]
    return new_color_string


# In[]
def change_svg_color(svg_content, new_color):
    old_color_string = "fill:#000000"
    new_color_string = get_new_color_string(new_color)
    return svg_content.replace(old_color_string, new_color_string)


# In[]
def get_svg_output_path(input_svg_path):
    output_svg_path = input_svg_path.replace(".svg", "_colored.svg")
    print(output_svg_path)
    return output_svg_path


# In[]
def read_svg_file(input_svg_path):
    fid = open(input_svg_path)
    content = fid.read()
    fid.close()
    return content


# In[]
def write_svg_file(output_svg_path, svg_content):
    fid = open(output_svg_path, "w")
    fid.write(svg_content)
    fid.close()


# In[]
if __name__ == "__main__":

###############################################################################
    new_color = [56, 112, 37]
###############################################################################

    for input_svg_path in find_input_svg_files():

        svg_content = read_svg_file(input_svg_path)
        colored_svg_content = change_svg_color(svg_content, new_color)

        output_svg_path = get_svg_output_path(input_svg_path)
        write_svg_file(output_svg_path, colored_svg_content)
