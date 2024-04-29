import cv2
import numpy as np
import base64


def get_gray_image(base64_data):
    # 从 base64 字符串中解码图像数据
    img_data = base64.b64decode(base64_data)
    nparr = np.frombuffer(img_data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # 将图像转换为灰度图
    gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # 将灰度图像转换为 base64 字符串
    _, encoded_img = cv2.imencode('.png', gray_img)
    gray_img_str = base64.b64encode(encoded_img).decode('utf-8')

    return gray_img_str


def test():
    return 1 + 2

def test2():
    return 'hello world'
