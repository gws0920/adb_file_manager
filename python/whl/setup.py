from setuptools import setup, find_packages

setup(
    name='test_pkg',
    version='0.4',
    packages=find_packages(),
    install_requires=[
        'opencv-python',
        'numpy',
    ],
)
