# -*- coding: utf-8 -*-
"""
Created on Thu Oct 24 21:02:59 2019

adapted from https://stackoverflow.com/questions/36762098/how-to-decrypt-password-from-javascript-cryptojs-aes-encryptpassword-passphras

@author: Michi
"""

from Crypto import Random
from Crypto.Cipher import AES
import base64
from hashlib import md5

BLOCK_SIZE = 16


# In[] Encrypt like CryptoJS does
def encrypt(secret, password):
    assert(isinstance(secret, bytes))
    salt = _generate_salt()
    aes_instance = _create_aes_instance(password, salt)
    padded_secret = _add_padding(secret)
    encrypted = aes_instance.encrypt(padded_secret)
    return _encode(encrypted, salt)

def _generate_salt():
    return Random.new().read(8)

def _add_padding(secret):
    padding_length = BLOCK_SIZE - (len(secret) % BLOCK_SIZE)
    padding_byte = chr(padding_length)
    padding = (padding_byte * padding_length).encode()
    return secret + padding

def _encode(encrypted, salt):
    return base64.b64encode(b"Salted__" + salt + encrypted)


# In[] Decrypt like CryptoJS does
def decrypt(encrypted, password):
    salt = _extract_salt(encrypted)
    data = _extract_data(encrypted)
    aes_instance = _create_aes_instance(password, salt)
    decrypted = aes_instance.decrypt(data)
    return _remove_padding(decrypted)

def _extract_salt(encrypted):
    decoded = base64.b64decode(encrypted)
    assert decoded[0:8] == b"Salted__"
    return decoded[8:16]

def _extract_data(encrypted):
    decoded = base64.b64decode(encrypted)
    return decoded[16:]

def _remove_padding(data):
    padding_length = data[-1]
    if not isinstance(padding_length, int):
        padding_length = ord(padding_length)
    return data[0:-padding_length]


# In[]
def _create_aes_instance(password, salt):
    key = _get_key(password, salt)
    iv  = _get_iv(password, salt)
    return AES.new(key, AES.MODE_CBC, iv)

def _get_key(password, salt):
    key = _convert_password_to_key(password, salt)
    return key[0:32]

def _get_iv(password, salt):
    key = _convert_password_to_key(password, salt)
    return key[32:48]

def _convert_password_to_key(password, salt):
    output_length = 48
    key = b""
    final_key = b""
    while len(final_key) < output_length:
        key = _get_md5_hash(key + password + salt)
        final_key += key
    return final_key[0:output_length]

def _get_md5_hash(data):
    assert(isinstance(data, bytes))
    return md5(data).digest()


# In[]
"""
This script supports having an unencrypted copy of the homepage that is used for
development. You can there use the two marks "@@start@@" and "@@end@@" to indicate
the secret html code, that should be encrypted. The encrypted code will be saved
as part of a javascript file with the single method "get_content", returning the
encrypted html code.
Please adjust the paths below as needed!
"""

if __name__ == "__main__":


###############################################################################
    import crypto_config
    path_to_input_file  = crypto_config.path_to_input_file
    path_to_output_file = crypto_config.path_to_output_file
    password            = crypto_config.password
###############################################################################

    fid = open(path_to_input_file, encoding="utf-8")
    content = fid.readlines()
    fid.close()

    start = 0
    end = 0
    for index in range(len(content)):
        line = content[index]
        if "@@start@@" in line:
            start = index + 1
        if "@@end@@" in line:
            end = index

    page_content = "\n".join(content[start:end]).encode()
    encrypted_page = encrypt(page_content, password)
    fid = open(path_to_output_file, "w")
    content = "function get_content()\n{\n\treturn \"" + encrypted_page.decode() + "\";\n}"
    fid.write(content)
    fid.close()

# %%
