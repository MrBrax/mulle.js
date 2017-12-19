#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os, sys, struct

from subprocess import call

from enum import Enum

import json

import wave, aifc, sunau

import glob

from PIL import Image, ImageDraw, ImagePalette

import bitstring


PALETTE_MAC = [
	0x00, 0x00, 0x00, 0x00, 0x11, 0x11, 0x11, 0x00, 0x22, 0x22, 0x22, 0x00, 0x44, 0x44, 0x44, 0x00, 0x55, 0x55, 0x55, 0x00, 0x77, 0x77, 0x77, 0x00, 0x88, 0x88, 0x88, 0x00, 0xAA, 0xAA, 0xAA, 0x00, 0xBB, 0xBB, 0xBB, 0x00, 0xDD, 0xDD, 0xDD, 0x00, 0xEE, 0xEE, 0xEE, 0x00, 0x11, 0x00, 0x00,
	0x00, 0x22, 0x00, 0x00, 0x00, 0x44, 0x00, 0x00, 0x00, 0x55, 0x00, 0x00, 0x00, 0x77, 0x00, 0x00, 0x00, 0x88, 0x00, 0x00, 0x00, 0xAA, 0x00, 0x00, 0x00, 0xBB, 0x00, 0x00, 0x00, 0xDD, 0x00, 0x00, 0x00, 0xEE, 0x00, 0x00, 0x00, 0x00, 0x11, 0x00, 0x00, 0x00, 0x22, 0x00, 0x00, 0x00, 0x44,
	0x00, 0x00, 0x00, 0x55, 0x00, 0x00, 0x00, 0x77, 0x00, 0x00, 0x00, 0x88, 0x00, 0x00, 0x00, 0xAA, 0x00, 0x00, 0x00, 0xBB, 0x00, 0x00, 0x00, 0xDD, 0x00, 0x00, 0x00, 0xEE, 0x00, 0x00, 0x00, 0x00, 0x11, 0x00, 0x00, 0x00, 0x22, 0x00, 0x00, 0x00, 0x44, 0x00, 0x00, 0x00, 0x55, 0x00, 0x00,
	0x00, 0x77, 0x00, 0x00, 0x00, 0x88, 0x00, 0x00, 0x00, 0xAA, 0x00, 0x00, 0x00, 0xBB, 0x00, 0x00, 0x00, 0xDD, 0x00, 0x00, 0x00, 0xEE, 0x00, 0x33, 0x00, 0x00, 0x00, 0x66, 0x00, 0x00, 0x00, 0x99, 0x00, 0x00, 0x00, 0xCC, 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00, 0x33, 0x00, 0x00,
	0x33, 0x33, 0x00, 0x00, 0x66, 0x33, 0x00, 0x00, 0x99, 0x33, 0x00, 0x00, 0xCC, 0x33, 0x00, 0x00, 0xFF, 0x33, 0x00, 0x00, 0x00, 0x66, 0x00, 0x00, 0x33, 0x66, 0x00, 0x00, 0x66, 0x66, 0x00, 0x00, 0x99, 0x66, 0x00, 0x00, 0xCC, 0x66, 0x00, 0x00, 0xFF, 0x66, 0x00, 0x00, 0x00, 0x99, 0x00,
	0x00, 0x33, 0x99, 0x00, 0x00, 0x66, 0x99, 0x00, 0x00, 0x99, 0x99, 0x00, 0x00, 0xCC, 0x99, 0x00, 0x00, 0xFF, 0x99, 0x00, 0x00, 0x00, 0xCC, 0x00, 0x00, 0x33, 0xCC, 0x00, 0x00, 0x66, 0xCC, 0x00, 0x00, 0x99, 0xCC, 0x00, 0x00, 0xCC, 0xCC, 0x00, 0x00, 0xFF, 0xCC, 0x00, 0x00, 0x00, 0xFF,
	0x00, 0x00, 0x33, 0xFF, 0x00, 0x00, 0x66, 0xFF, 0x00, 0x00, 0x99, 0xFF, 0x00, 0x00, 0xCC, 0xFF, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x00, 0x33, 0x00, 0x33, 0x00, 0x33, 0x00, 0x66, 0x00, 0x33, 0x00, 0x99, 0x00, 0x33, 0x00, 0xCC, 0x00, 0x33, 0x00, 0xFF, 0x00, 0x33, 0x00, 0x00,
	0x33, 0x33, 0x00, 0x33, 0x33, 0x33, 0x00, 0x66, 0x33, 0x33, 0x00, 0x99, 0x33, 0x33, 0x00, 0xCC, 0x33, 0x33, 0x00, 0xFF, 0x33, 0x33, 0x00, 0x00, 0x66, 0x33, 0x00, 0x33, 0x66, 0x33, 0x00, 0x66, 0x66, 0x33, 0x00, 0x99, 0x66, 0x33, 0x00, 0xCC, 0x66, 0x33, 0x00, 0xFF, 0x66, 0x33, 0x00,
	0x00, 0x99, 0x33, 0x00, 0x33, 0x99, 0x33, 0x00, 0x66, 0x99, 0x33, 0x00, 0x99, 0x99, 0x33, 0x00, 0xCC, 0x99, 0x33, 0x00, 0xFF, 0x99, 0x33, 0x00, 0x00, 0xCC, 0x33, 0x00, 0x33, 0xCC, 0x33, 0x00, 0x66, 0xCC, 0x33, 0x00, 0x99, 0xCC, 0x33, 0x00, 0xCC, 0xCC, 0x33, 0x00, 0xFF, 0xCC, 0x33,
	0x00, 0x00, 0xFF, 0x33, 0x00, 0x33, 0xFF, 0x33, 0x00, 0x66, 0xFF, 0x33, 0x00, 0x99, 0xFF, 0x33, 0x00, 0xCC, 0xFF, 0x33, 0x00, 0xFF, 0xFF, 0x33, 0x00, 0x00, 0x00, 0x66, 0x00, 0x33, 0x00, 0x66, 0x00, 0x66, 0x00, 0x66, 0x00, 0x99, 0x00, 0x66, 0x00, 0xCC, 0x00, 0x66, 0x00, 0xFF, 0x00,
	0x66, 0x00, 0x00, 0x33, 0x66, 0x00, 0x33, 0x33, 0x66, 0x00, 0x66, 0x33, 0x66, 0x00, 0x99, 0x33, 0x66, 0x00, 0xCC, 0x33, 0x66, 0x00, 0xFF, 0x33, 0x66, 0x00, 0x00, 0x66, 0x66, 0x00, 0x33, 0x66, 0x66, 0x00, 0x66, 0x66, 0x66, 0x00, 0x99, 0x66, 0x66, 0x00, 0xCC, 0x66, 0x66, 0x00, 0xFF,
	0x66, 0x66, 0x00, 0x00, 0x99, 0x66, 0x00, 0x33, 0x99, 0x66, 0x00, 0x66, 0x99, 0x66, 0x00, 0x99, 0x99, 0x66, 0x00, 0xCC, 0x99, 0x66, 0x00, 0xFF, 0x99, 0x66, 0x00, 0x00, 0xCC, 0x66, 0x00, 0x33, 0xCC, 0x66, 0x00, 0x66, 0xCC, 0x66, 0x00, 0x99, 0xCC, 0x66, 0x00, 0xCC, 0xCC, 0x66, 0x00,
	0xFF, 0xCC, 0x66, 0x00, 0x00, 0xFF, 0x66, 0x00, 0x33, 0xFF, 0x66, 0x00, 0x66, 0xFF, 0x66, 0x00, 0x99, 0xFF, 0x66, 0x00, 0xCC, 0xFF, 0x66, 0x00, 0xFF, 0xFF, 0x66, 0x00, 0x00, 0x00, 0x99, 0x00, 0x33, 0x00, 0x99, 0x00, 0x66, 0x00, 0x99, 0x00, 0x99, 0x00, 0x99, 0x00, 0xCC, 0x00, 0x99,
	0x00, 0xFF, 0x00, 0x99, 0x00, 0x00, 0x33, 0x99, 0x00, 0x33, 0x33, 0x99, 0x00, 0x66, 0x33, 0x99, 0x00, 0x99, 0x33, 0x99, 0x00, 0xCC, 0x33, 0x99, 0x00, 0xFF, 0x33, 0x99, 0x00, 0x00, 0x66, 0x99, 0x00, 0x33, 0x66, 0x99, 0x00, 0x66, 0x66, 0x99, 0x00, 0x99, 0x66, 0x99, 0x00, 0xCC, 0x66,
	0x99, 0x00, 0xFF, 0x66, 0x99, 0x00, 0x00, 0x99, 0x99, 0x00, 0x33, 0x99, 0x99, 0x00, 0x66, 0x99, 0x99, 0x00, 0x99, 0x99, 0x99, 0x00, 0xCC, 0x99, 0x99, 0x00, 0xFF, 0x99, 0x99, 0x00, 0x00, 0xCC, 0x99, 0x00, 0x33, 0xCC, 0x99, 0x00, 0x66, 0xCC, 0x99, 0x00, 0x99, 0xCC, 0x99, 0x00, 0xCC,
	0xCC, 0x99, 0x00, 0xFF, 0xCC, 0x99, 0x00, 0x00, 0xFF, 0x99, 0x00, 0x33, 0xFF, 0x99, 0x00, 0x66, 0xFF, 0x99, 0x00, 0x99, 0xFF, 0x99, 0x00, 0xCC, 0xFF, 0x99, 0x00, 0xFF, 0xFF, 0x99, 0x00, 0x00, 0x00, 0xCC, 0x00, 0x33, 0x00, 0xCC, 0x00, 0x66, 0x00, 0xCC, 0x00, 0x99, 0x00, 0xCC, 0x00,
	0xCC, 0x00, 0xCC, 0x00, 0xFF, 0x00, 0xCC, 0x00, 0x00, 0x33, 0xCC, 0x00, 0x33, 0x33, 0xCC, 0x00, 0x66, 0x33, 0xCC, 0x00, 0x99, 0x33, 0xCC, 0x00, 0xCC, 0x33, 0xCC, 0x00, 0xFF, 0x33, 0xCC, 0x00, 0x00, 0x66, 0xCC, 0x00, 0x33, 0x66, 0xCC, 0x00, 0x66, 0x66, 0xCC, 0x00, 0x99, 0x66, 0xCC,
	0x00, 0xCC, 0x66, 0xCC, 0x00, 0xFF, 0x66, 0xCC, 0x00, 0x00, 0x99, 0xCC, 0x00, 0x33, 0x99, 0xCC, 0x00, 0x66, 0x99, 0xCC, 0x00, 0x99, 0x99, 0xCC, 0x00, 0xCC, 0x99, 0xCC, 0x00, 0xFF, 0x99, 0xCC, 0x00, 0x00, 0xCC, 0xCC, 0x00, 0x33, 0xCC, 0xCC, 0x00, 0x66, 0xCC, 0xCC, 0x00, 0x99, 0xCC,
	0xCC, 0x00, 0xCC, 0xCC, 0xCC, 0x00, 0xFF, 0xCC, 0xCC, 0x00, 0x00, 0xFF, 0xCC, 0x00, 0x33, 0xFF, 0xCC, 0x00, 0x66, 0xFF, 0xCC, 0x00, 0x99, 0xFF, 0xCC, 0x00, 0xCC, 0xFF, 0xCC, 0x00, 0xFF, 0xFF, 0xCC, 0x00, 0x00, 0x00, 0xFF, 0x00, 0x33, 0x00, 0xFF, 0x00, 0x66, 0x00, 0xFF, 0x00, 0x99,
	0x00, 0xFF, 0x00, 0xCC, 0x00, 0xFF, 0x00, 0xFF, 0x00, 0xFF, 0x00, 0x00, 0x33, 0xFF, 0x00, 0x33, 0x33, 0xFF, 0x00, 0x66, 0x33, 0xFF, 0x00, 0x99, 0x33, 0xFF, 0x00, 0xCC, 0x33, 0xFF, 0x00, 0xFF, 0x33, 0xFF, 0x00, 0x00, 0x66, 0xFF, 0x00, 0x33, 0x66, 0xFF, 0x00, 0x66, 0x66, 0xFF, 0x00,
	0x99, 0x66, 0xFF, 0x00, 0xCC, 0x66, 0xFF, 0x00, 0xFF, 0x66, 0xFF, 0x00, 0x00, 0x99, 0xFF, 0x00, 0x33, 0x99, 0xFF, 0x00, 0x66, 0x99, 0xFF, 0x00, 0x99, 0x99, 0xFF, 0x00, 0xCC, 0x99, 0xFF, 0x00, 0xFF, 0x99, 0xFF, 0x00, 0x00, 0xCC, 0xFF, 0x00, 0x33, 0xCC, 0xFF, 0x00, 0x66, 0xCC, 0xFF,
	0x00, 0x99, 0xCC, 0xFF, 0x00, 0xCC, 0xCC, 0xFF, 0x00, 0xFF, 0xCC, 0xFF, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x33, 0xFF, 0xFF, 0x00, 0x66, 0xFF, 0xFF, 0x00, 0x99, 0xFF, 0xFF, 0x00, 0xCC, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0xFF, 0x00 
]

PALETTE_WIN = [
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xBF, 0x00, 0x00, 0xBF, 0x00, 0x00, 0x00, 0xBF, 0xBF, 0x00, 0xBF, 0x00, 0x00, 0x00, 0xBF, 0x00, 0xBF, 0x00, 0xBF, 0xBF, 0x00, 0x00, 0xC0, 0xC0, 0xC0, 0x00, 0xC0, 0xDC, 0xC0, 0x00, 0xF0, 0xC8, 0xA4, 0x00, 0xF0, 0xF0, 0xF0, 0x00, 0x99, 0xFF, 0xFF,
	0x00, 0x99, 0xD4, 0x99, 0x00, 0xFF, 0xD4, 0x99, 0x00, 0xFF, 0xCC, 0xFF, 0x00, 0x99, 0x99, 0xFF, 0x00, 0x30, 0x22, 0x22, 0x00, 0x11, 0x00, 0x00, 0x00, 0x22, 0x00, 0x00, 0x00, 0x44, 0x00, 0x00, 0x00, 0x55, 0x00, 0x00, 0x00, 0x77, 0x00, 0x00, 0x00, 0x88, 0x00, 0x00, 0x00, 0xAA, 0x00,
	0x00, 0x00, 0xDD, 0x00, 0x00, 0x00, 0xEE, 0x00, 0x00, 0x00, 0x00, 0x11, 0x00, 0x00, 0x00, 0x22, 0x00, 0x00, 0x00, 0x44, 0x00, 0x00, 0x00, 0x55, 0x00, 0x00, 0x00, 0x77, 0x00, 0x00, 0x00, 0x88, 0x00, 0x00, 0x00, 0xAA, 0x00, 0x00, 0x00, 0xDD, 0x00, 0x00, 0x00, 0xEE, 0x00, 0x00, 0x00,
	0x00, 0x11, 0x00, 0x00, 0x00, 0x22, 0x00, 0x00, 0x00, 0x44, 0x00, 0x00, 0x00, 0x55, 0x00, 0x00, 0x00, 0x77, 0x00, 0x00, 0x00, 0x90, 0x00, 0x00, 0x00, 0xAA, 0x00, 0x00, 0x00, 0xDD, 0x00, 0x00, 0x00, 0xEE, 0x00, 0x33, 0x00, 0x00, 0x00, 0x66, 0x00, 0x00, 0x00, 0x99, 0x00, 0x00, 0x00,
	0xCC, 0x00, 0x00, 0x00, 0x00, 0x33, 0x00, 0x00, 0x33, 0x33, 0x00, 0x00, 0x66, 0x33, 0x00, 0x00, 0xA1, 0x33, 0x00, 0x00, 0xCC, 0x33, 0x00, 0x00, 0xFF, 0x33, 0x00, 0x00, 0x00, 0x66, 0x00, 0x00, 0x33, 0x66, 0x00, 0x00, 0x66, 0x66, 0x00, 0x00, 0x99, 0x66, 0x00, 0x00, 0xCC, 0x66, 0x00,
	0x00, 0xFF, 0x66, 0x00, 0x00, 0x00, 0x99, 0x00, 0x00, 0x33, 0x99, 0x00, 0x00, 0x66, 0x99, 0x00, 0x00, 0x99, 0x99, 0x00, 0x00, 0xCC, 0x99, 0x00, 0x00, 0xFF, 0x99, 0x00, 0x00, 0x00, 0xCC, 0x00, 0x00, 0x33, 0xCC, 0x00, 0x00, 0x66, 0xCC, 0x00, 0x00, 0x99, 0xCC, 0x00, 0x00, 0xCC, 0xCC,
	0x00, 0x00, 0xFF, 0xCC, 0x00, 0x00, 0x33, 0xFF, 0x00, 0x00, 0x66, 0xFF, 0x00, 0x00, 0x99, 0xFF, 0x00, 0x00, 0xCC, 0xFF, 0x00, 0x00, 0x00, 0x00, 0x33, 0x00, 0x33, 0x00, 0x33, 0x00, 0x66, 0x00, 0x33, 0x00, 0x99, 0x00, 0x33, 0x00, 0xCC, 0x00, 0x33, 0x00, 0xFF, 0x00, 0x33, 0x00, 0x00,
	0x33, 0x33, 0x00, 0x3B, 0x33, 0x33, 0x00, 0x66, 0x33, 0x33, 0x00, 0x99, 0x33, 0x33, 0x00, 0xCC, 0x33, 0x33, 0x00, 0xFF, 0x33, 0x33, 0x00, 0x00, 0x66, 0x33, 0x00, 0x33, 0x6E, 0x33, 0x00, 0x66, 0x66, 0x33, 0x00, 0x99, 0x66, 0x33, 0x00, 0xCC, 0x66, 0x33, 0x00, 0xFF, 0x66, 0x33, 0x00,
	0x00, 0x99, 0x33, 0x00, 0x33, 0x99, 0x33, 0x00, 0x66, 0x99, 0x33, 0x00, 0x99, 0x99, 0x33, 0x00, 0xCC, 0x99, 0x33, 0x00, 0xFF, 0x99, 0x33, 0x00, 0x00, 0xCC, 0x33, 0x00, 0x33, 0xCC, 0x33, 0x00, 0x66, 0xCC, 0x33, 0x00, 0x99, 0xCC, 0x33, 0x00, 0xCC, 0xCC, 0x33, 0x00, 0xFF, 0xCC, 0x33,
	0x00, 0x00, 0xFF, 0x33, 0x00, 0x33, 0xFF, 0x33, 0x00, 0x66, 0xFF, 0x33, 0x00, 0x99, 0xFF, 0x33, 0x00, 0xCC, 0xFF, 0x33, 0x00, 0xFF, 0xFF, 0x33, 0x00, 0x00, 0x00, 0x66, 0x00, 0x33, 0x00, 0x66, 0x00, 0x66, 0x00, 0x66, 0x00, 0x99, 0x00, 0x66, 0x00, 0xCC, 0x00, 0x66, 0x00, 0xFF, 0x00,
	0x66, 0x00, 0x00, 0x33, 0x66, 0x00, 0x33, 0x33, 0x66, 0x00, 0x66, 0x33, 0x66, 0x00, 0x99, 0x33, 0x66, 0x00, 0xCC, 0x33, 0x66, 0x00, 0xFF, 0x33, 0x66, 0x00, 0x00, 0x66, 0x66, 0x00, 0x33, 0x66, 0x66, 0x00, 0x66, 0x66, 0x66, 0x00, 0x99, 0x66, 0x66, 0x00, 0xCC, 0x66, 0x66, 0x00, 0xFF,
	0x66, 0x66, 0x00, 0x00, 0x99, 0x66, 0x00, 0x33, 0x99, 0x66, 0x00, 0x66, 0x99, 0x66, 0x00, 0x99, 0x99, 0x66, 0x00, 0xCC, 0x99, 0x66, 0x00, 0xFF, 0x99, 0x66, 0x00, 0x00, 0xCC, 0x66, 0x00, 0x33, 0xCC, 0x66, 0x00, 0x66, 0xCC, 0x66, 0x00, 0x99, 0xCC, 0x66, 0x00, 0xCC, 0xCC, 0x66, 0x00,
	0xFF, 0xCC, 0x66, 0x00, 0x00, 0xFF, 0x66, 0x00, 0x33, 0xFF, 0x66, 0x00, 0x66, 0xFF, 0x66, 0x00, 0x99, 0xFF, 0x66, 0x00, 0xCC, 0xFF, 0x66, 0x00, 0xFF, 0xFF, 0x66, 0x00, 0x00, 0x00, 0x99, 0x00, 0x33, 0x00, 0x99, 0x00, 0x66, 0x00, 0x99, 0x00, 0x99, 0x00, 0x99, 0x00, 0xCC, 0x00, 0x99,
	0x00, 0xFF, 0x00, 0x99, 0x00, 0x00, 0x33, 0x99, 0x00, 0x33, 0x33, 0x99, 0x00, 0x66, 0x33, 0x99, 0x00, 0x99, 0x33, 0x99, 0x00, 0xCC, 0x33, 0x99, 0x00, 0xFF, 0x33, 0x99, 0x00, 0x00, 0x66, 0xA1, 0x00, 0x33, 0x66, 0x99, 0x00, 0x66, 0x66, 0x99, 0x00, 0x99, 0x66, 0x99, 0x00, 0xCC, 0x66,
	0x99, 0x00, 0xFF, 0x66, 0x99, 0x00, 0x00, 0x99, 0x99, 0x00, 0x33, 0x99, 0x99, 0x00, 0x66, 0x99, 0x99, 0x00, 0x99, 0x99, 0x99, 0x00, 0xCC, 0x99, 0x99, 0x00, 0xFF, 0x99, 0x99, 0x00, 0x00, 0xCC, 0x99, 0x00, 0x33, 0xCC, 0x99, 0x00, 0x66, 0xCC, 0x99, 0x00, 0x99, 0xCC, 0x99, 0x00, 0xCC,
	0xCC, 0x99, 0x00, 0xFF, 0xCC, 0x99, 0x00, 0x00, 0xFF, 0x99, 0x00, 0x33, 0xFF, 0x99, 0x00, 0x66, 0xFF, 0x99, 0x00, 0x99, 0xFF, 0x99, 0x00, 0xCC, 0xFF, 0x99, 0x00, 0xFF, 0xFF, 0x99, 0x00, 0x00, 0x00, 0xCC, 0x00, 0x33, 0x00, 0xCC, 0x00, 0x66, 0x00, 0xCC, 0x00, 0x99, 0x00, 0xCC, 0x00,
	0xCC, 0x00, 0xCC, 0x00, 0xFF, 0x08, 0xD4, 0x00, 0x00, 0x33, 0xCC, 0x00, 0x33, 0x33, 0xCC, 0x00, 0x66, 0x33, 0xCC, 0x00, 0x99, 0x33, 0xCC, 0x00, 0xCC, 0x33, 0xCC, 0x00, 0xFF, 0x33, 0xCC, 0x00, 0x00, 0x66, 0xCC, 0x00, 0x33, 0x66, 0xCC, 0x00, 0x66, 0x66, 0xCC, 0x00, 0x99, 0x66, 0xCC,
	0x00, 0xCC, 0x66, 0xCC, 0x00, 0xFF, 0x66, 0xCC, 0x00, 0x00, 0x99, 0xCC, 0x00, 0x33, 0x99, 0xCC, 0x00, 0x66, 0x99, 0xCC, 0x00, 0x99, 0x99, 0xCC, 0x00, 0xCC, 0x99, 0xCC, 0x00, 0xFF, 0x99, 0xCC, 0x00, 0x00, 0xCC, 0xCC, 0x00, 0x33, 0xCC, 0xCC, 0x00, 0x66, 0xCC, 0xCC, 0x00, 0x99, 0xCC,
	0xCC, 0x00, 0xCC, 0xCC, 0xCC, 0x00, 0xFF, 0xCC, 0xCC, 0x00, 0x00, 0xFF, 0xCC, 0x00, 0x33, 0xFF, 0xCC, 0x00, 0x66, 0xFF, 0xCC, 0x00, 0x99, 0xFF, 0xCC, 0x00, 0xCC, 0xFF, 0xCC, 0x00, 0xFF, 0xFF, 0xCC, 0x00, 0x33, 0x00, 0xFF, 0x00, 0x66, 0x00, 0xFF, 0x00, 0x99, 0x00, 0xFF, 0x00, 0xCC,
	0x00, 0xFF, 0x00, 0x00, 0x33, 0xFF, 0x00, 0x33, 0x33, 0xFF, 0x00, 0x66, 0x33, 0xFF, 0x00, 0x99, 0x33, 0xFF, 0x00, 0xCC, 0x33, 0xFF, 0x00, 0xFF, 0x33, 0xFF, 0x00, 0x00, 0x66, 0xFF, 0x00, 0x33, 0x66, 0xFF, 0x00, 0x66, 0x66, 0xFF, 0x00, 0x99, 0x66, 0xFF, 0x00, 0xCC, 0x66, 0xFF, 0x00,
	0xFF, 0x66, 0xFF, 0x00, 0x00, 0x99, 0xFF, 0x00, 0xDD, 0xDD, 0xDD, 0x00, 0xCC, 0x99, 0xFF, 0x00, 0x66, 0xCC, 0xFF, 0x00, 0x00, 0x00, 0x88, 0x00, 0xFF, 0x00, 0xCC, 0x00, 0x99, 0x33, 0x00, 0x00, 0x33, 0x66, 0x33, 0x00, 0x00, 0x66, 0x99, 0x00, 0x33, 0x33, 0x33, 0x00, 0xF0, 0xFB, 0xFF,
	0x00, 0xA4, 0xA0, 0xA0, 0x00, 0x80, 0x80, 0x80, 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0xFF, 0x00, 0x00, 0x00, 0xFF, 0x00, 0xFF, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0x00
]

OPAQUE = {
	'00.CXT': [
		64,
		65,
		66,
		67,
		68,
		69,
		70,
		71,
		72,
		75,
		76,
		81,
		83,
		84,
		86
	],
	'02.DXR': [
		66, 68, 69, 70, 71, 72
	],
	'03.DXR': [
		33,
		100,
		101
	],
	'04.DXR': [
		16, 17, 27, 30, 37, 116, 117, 118, 228, 229, 230
	],
	'05.DXR': [
		25, 26, 53, 54, 57
	],
	'10.DXR': [
		1, 2, 5, 12, 13, 92, 93, 94, 95, 96, 173, 174, 188
	],
	'18.DXR': [
		8, 12, 13
	],
	'84.DXR': [
		25
	],
	'85.DXR': [
		25
	],
	'86.DXR': [
		1
	],
	'87.DXR': [
		15, 16, 17, 18,
		208
	],
	'88.DXR': [
		
		32,
		33, 34, 35, 36, 37, 38,
		
		40,
		41, 42, 43, 44, 45, 46,

		92, 93,

		96, 97,

		100, 101

	],
	'92.DXR': [
		1
	],
	'94.DXR': [
		200
	],
	'CDDATA.CXT': [
		629, 630, 631, 632, 633, 634, 635, 636, 637, 638, 639,
		640, 641, 642, 643, 644, 645, 646, 647, 648, 649, 650,
		651, 652, 653, 654, 656, 657, 658
	],
	'Plugin.cst': [
		18
	]
}

class CastType(Enum):
	BITMAP = 1 
	FILMLOOP = 2 
	FIELD = 3 
	PALETTE = 4 
	PICT = 5 
	SOUND = 6 
	BUTTON = 7 
	SHAPE = 8 
	MOVIE = 9 
	DIGITALVIDEO = 10
	SCRIPT = 11
	TEXT = 12
	OLE = 13
	TRANSITION = 14

class ShockwaveParser:

	versionTable = {
		'04c7': '6.0',
		'057e': '7.0',
		'0640': '8.0',
		'073a': '8.5 or 9.0',
		'0744': '10.1',
		'0782': '11.5.0r593',
		'0783': '11.5.8.612',
		'079f': '12',
		'7061': '??'
	}

	def __init__(self, file):

		self.fileName = file

		self.baseName = os.path.basename(self.fileName)

		self.version = 0
		self.shockwaveVersion = ""
		self.createdBy = ""
		self.modifiedBy = ""
		self.filePath = ""

		self.movieWidth = 0
		self.movieHeight = 0

		self.fileEntries = []
		self.castLibraries = []
		self.textContents = {}

		self.forceLittle = False

	def log(self, t):
		print(t)

	def readByte(self, big):
		return struct.unpack( ('b' if big else '>b'), self.f.read(1) )[0]

	def readUInt16(self, big):
		return struct.unpack( ('H' if big else '>H'), self.f.read(2) )[0]

	def readInt16(self, big):
		return struct.unpack( ('h' if big else '>h'), self.f.read(2) )[0]

	def readUInt32(self, big):
		return struct.unpack( ('I' if big else '>I'), self.f.read(4) )[0]

	def readInt32(self, big):
		return struct.unpack( ('i' if big else '>i'), self.f.read(4) )[0]

	def readString(self, l, big):
		if big:
			return self.f.read(l).decode("ansi")[::-1]
		else:
			return self.f.read(l).decode("ansi")

	def readLenString(self, big):

		# l = struct.unpack('B', self.f.read(1) )[0]
		l = ord( self.f.read(1) )

		if l == 0:
			txt = ""
		else:
			txt = self.f.read(l).decode("ansi")

		if self.BigEndian:
			self.f.seek(1, 1)

		#if l & 1 == 0:
		#	self.f.seek(1, 1)

		if big:
			return txt[::-1]
		else:
			return txt

	def read(self):

		self.log("Filename: " + str(self.fileName) )

		self.f = open(self.fileName, "rb")

		# FourCC
		self.fileHeader = self.readString(4, False) # 0->4

		if self.fileHeader != "RIFX" and self.fileHeader != "XFIR":
			raise Exception("Not a Shockwave file")
			return

		self.log("Header: " + str(self.fileHeader) )

		if self.fileHeader == "RIFX":
			self.BigEndian = False
		else:
			self.BigEndian = True

		if self.forceLittle:
			self.BigEndian = False

		self.log("Big Endian: " + str(self.BigEndian) )

		self.fileSize = self.readInt32(self.BigEndian) # 4->8
		self.log("Size: " + str(self.fileSize) + " (" + str( round( self.fileSize / 1024, 2 ) ) + "kB)")

		self.fileSign = self.readString(4, True) # 8->12
		self.log("Sign: " + str(self.fileSign) )


		# imap
		self.log("")
		self.log("IMAP: " + str( self.readString(4, True) ) )
		self.log("IMAP Length: " + str( self.readInt32(True) ) )
		
		# self.f.seek(1,1) # unknown
		self.log("IMAP Unknown: " + str( self.readInt32(self.BigEndian) ) )
		
		mmapOffset = self.readInt32(self.BigEndian)
		self.log("MMAP offset: " + str( mmapOffset ) )

		# imap
		#self.f.seek(mmapOffset, 0)
		#self.log("")
		#

		# self.log("MMAP offset: " + str( self.readInt32(self.BigEndian) ) )
		
		self.f.seek(mmapOffset, 0)
		self.log("MMAP: " + str( self.readString(4, True) ) )
		self.log("MMAP Length: " + str( self.readInt32(True) ) )
		
		# self.f.seek(4,1)

		self.version = 0xf000 + self.readInt32(self.BigEndian)
		self.log("Version: " + str( self.version ) )

		# skip to offset 60, just for convenience
		
		#self.f.seek(72, 0)
		# self.
		
		self.log("Something1: " + str( self.readInt32(True) ) )

		# print( self.f.tell() )

		self.fileNum = self.readInt32(self.BigEndian)
		self.log("Files: " + str(self.fileNum) )

		self.log("Something2: " + str( self.readInt32(True) ) )
		self.log("Something3: " + str( self.readInt32(True) ) )
		self.log("Something4: " + str( self.readInt32(True) ) )

		# self.f.seek(12, 1) # skip 12

		# self.log("\n# Read MMAP")

		self.fileEntries = []

		# files
		for i in range(0, self.fileNum):

			pointerOffset = self.f.tell()

			entryType = self.readString(4, self.BigEndian)

			entryLength = self.readInt32(self.BigEndian)

			entryOffset = self.readInt32(self.BigEndian)

			unknown1 = self.readInt32(self.BigEndian)
			unknown2 = self.readInt32(self.BigEndian)

			fileEntry = {}

			fileEntry['id'] = i
			fileEntry['type'] = entryType
			fileEntry['dataLength'] = entryLength
			fileEntry['dataOffset'] = entryOffset
			fileEntry['pointerOffset'] = pointerOffset
			fileEntry['linkedEntries'] = []
			fileEntry['meta'] = {}

			self.fileEntries.append( fileEntry )

			
			#if entryType != "free":
			#	self.log(" [POINT " + str(i) + " @ " + str(pointerOffset) + "][" + (entryType) + "] " + str( entryLength ) + "b, Offset: " + str( entryOffset ) )
			#else:
			#	self.log(" [POINT " + str(i) + " @ " + str(pointerOffset) + "][----]")
			
		
		# metadata
		for i, e in enumerate(self.fileEntries):

			if e['type'] == "DRCF":
				entry = self.readEntry(i)
				self.shockwaveVersion = entry['version']

			if e['type'] == "MCsL":
				entry = self.readEntry(i)
				self.castLibraries = entry['castLibraries']

			if e['type'] == "VWFI":
				entry = self.readEntry(i)
				self.createdBy = entry['createdBy']
				self.modifiedBy = entry['modifiedBy']
				self.filePath = entry['filePath']

			if e['type'] == "VWCF":
				entry = self.readEntry(i)
				self.movieWidth = entry['movieWidth']
				self.movieHeight = entry['movieHeight']

			if e['type'] == "imap":
				entry = self.readEntry(i)

			# if e['type'] == "CASt":
			# 	entry = self.readEntry(i)


		if len(self.castLibraries) == 0:
			self.castLibraries.append({
				'id': 0,
				'name': 'Standalone',
				'members': {},
				'memberCount': -1,
				'linkedEntries': []
			})

		if self.movieWidth > 0 and self.movieHeight > 0:
			self.log("Dimensions: " + str( self.movieWidth ) + "x" + str( self.movieHeight ) )

		if self.shockwaveVersion:
			self.log("Shockwave version: " + str(self.shockwaveVersion) )

		if self.createdBy:
			self.log("Created by: " + str( self.createdBy ) )
			self.log("Modified by: " + str( self.modifiedBy ) )
			self.log("File path: " + str( self.filePath ) )

		self.log("Cast libraries: " + str( len(self.castLibraries) ) )

		for e in self.castLibraries:
			self.log(" " + e['name'] + ": " + str(e['memberCount']) )


		# KEY*
		for i, e in enumerate(self.fileEntries):
			if e['type'] == "KEY*":
				entry = self.readEntry(i)
				break


		# CAS*
		for e in self.castLibraries:

			if not 'libSlot' in e:
				# self.log("(No library slot for " + e["name"] + ")")
				continue

			# self.log("Parse cast library '" + str(e["name"]) + "'")

			e['members'] = {}
			
			casStar = self.readEntry( e["libSlot"] )

			if not 'members' in casStar:
				self.log("No members in cast " + e['name'])
				return

			# CASt
			for num in casStar['members']:

				slot = casStar['members'][num]

				# self.log("Num " + str(num) + ", Slot " + str(slot) )

				castMember = self.readEntry(slot)
				# castData = self.readEntry(slot)
				# 
				# print(castMember)
				
				# castMember = {}
				castMember['castSlot'] = num
				castMember['castLibrary'] = e['name']
				castMember['fileSlot'] = slot

				castMember['dataOffset'] = self.fileEntries[ slot ]['dataOffset']
				castMember['dataLength'] = self.fileEntries[ slot ]['dataLength']

				castMember['linkedEntries'] = self.fileEntries[ slot ]['linkedEntries']

				for linked in castMember['linkedEntries']:

					linkedEntry = self.readEntry(linked)

					# sound metadata
					if linkedEntry['type'] == "sndH":
						castMember['soundLength'] = linkedEntry['soundLength']
						castMember['soundSampleRate'] = linkedEntry['soundSampleRate']

					# sound metadata
					if linkedEntry['type'] == "snd " and 'soundSampleRate' in linkedEntry:
						castMember['soundSampleRate'] = linkedEntry['soundSampleRate']
						castMember['soundSampleSize'] = linkedEntry['soundSampleSize']
						castMember['soundDataLength'] = linkedEntry['soundDataLength']

					# cue points
					if linkedEntry['type'] == "cupt":
						castMember['soundCuePoints'] = linkedEntry['soundCuePoints']


					if linkedEntry['type'] == "CLUT":
						castMember['paletteData'] = linkedEntry['paletteData']


				e['members'][ num ] = castMember		


	def readEntry(self, num):
		
		entry = self.fileEntries[ num ]

		data = {}

		self.f.seek( entry['dataOffset'] )
		entryType = self.readString(4, self.BigEndian)
		entryLength = self.readInt32(self.BigEndian)

		data['type'] = entryType
		data['length'] = entryLength

		# if entry['type'] == "imap":
			# self.f.seek(8,1) # skip unknown data
			# print( "Protected: " + str(self.readByte(False)) )

		if entry['type'] == "MCsL":

			unknown1 = self.readInt32(False)

			castCount = self.readInt32(False)

			unknown2 = self.readInt32(False)

			arraySize = self.readInt32(False)

			data['castCount'] = castCount

			for j in range( 0, castCount ):
				ar0 = self.readInt32(False)
				ar1 = self.readInt32(False)
				ar2 = self.readInt32(False)
				ar3 = self.readInt32(False)
				# self.log( " [Off" + str(j) + "] 0: " + str(ar0) + ", 1: " + str(ar1) + ", 2: " + str(ar2) + ", 3: " + str(ar3) )

			unknown3 = self.readInt16(False)

			castLibrariesLength = self.readInt32(False)

			# data['castLibrariesLength'] = castLibrariesLength

			data['castLibraries'] = []

			for j in range( 0, castCount ):

				castLib = {}
				castLib['id'] = j

				castLib['name'] = self.readLenString(False)
				# self.f.seek(1,1)

				castLib['path'] = self.readLenString(False)
				if castLib['path']:
					castLib['external'] = True
					self.f.seek(2,1)
				else:
					castLib['external'] = False
				
				# self.f.seek(1,1)

				cPreloadSettings = self.readByte(False)

				cStorageType = self.readByte(False)

				castLib['memberCount'] = self.readInt16(False)

				cNumId = self.readInt32(False)

				'''
				self.log(" [Lib" + str(j) + "]")
				self.log("  Name: " + str(cName) )
				self.log("  Path: " + str(cPath) )
				self.log("  Members: " + str(cMemberCount) )
				self.log("  Preload: " + str(cPreloadSettings) )
				self.log("  Storage: " + str(cStorageType) )
				self.log("  Id: " + str(cNumId) )
				'''

				data['castLibraries'].append(castLib)


		if entry['type'] == "DRCF":

			self.f.seek(36, 1) # unknown data

			# combine hex
			version = struct.unpack("cc", self.f.read(2) )
			versionHex = str(version[0].hex()) + str(version[1].hex())

			data['version'] = self.versionTable[ versionHex ]


		if entry['type'] == "VWFI":

			skipLen = self.readInt32(False)

			self.f.seek(skipLen - 4, 1)

			fieldNum = self.readInt16(False)

			self.f.seek(4, 1)

			# data offsets
			offsets = []
			for i in range(0, fieldNum):
				offsets.append( self.readInt32(False) )

			dPos = self.f.tell()

			self.f.seek(dPos + offsets[0])
			data['createdBy'] = self.readLenString(False)

			self.f.seek(dPos + offsets[1])
			data['modifiedBy'] = self.readLenString(False)

			self.f.seek(dPos + offsets[2])
			data['filePath'] = self.readLenString(False)


		if entry['type'] == "VWCF":
			self.f.seek(8,1) # skip unknown data
			data['movieHeight'] = self.readInt16(False)
			data['movieWidth'] = self.readInt16(False)

		
		if entry['type'] == "CASt":

			data['castType'] = self.readInt32( False )

			data['castDataLength'] = self.readInt32(False)

			data['castEndDataLength'] = self.readInt32(False)

			data['castUnknown'] = []

			data['castFieldOffsets'] = []
			data['castFieldData'] = []

			data['name'] = ""

			# print( data['castDataLength'] )

			if data['castDataLength'] > 0:

				fieldStart = self.f.tell()

				# skip for some reason
				## skipLen = self.readInt32(False)
				## self.f.seek(skipLen - 4, 1)
				for i in range(0, 16):
					data['castUnknown'].append( self.readInt16(False) )


				# field amount
				castFieldNum = self.readInt16(False)
				
				# print( "[offset " + str(entry['dataOffset']) + "]")

				# print( "amount: " + str(castFieldNum) )

				# field offsets
				for k in range(0, castFieldNum):
					data['castFieldOffsets'].append( self.readInt32(False) )

				# print( "type: " + str(data['castType']) )
				
				# print(data['castFieldOffsets'])				

				# field size
				data['castFieldDataLength'] = self.readInt32(False)

				dataPos = self.f.tell()
				
				# read fields
				for k in range(0, castFieldNum):
					self.f.seek( dataPos + data['castFieldOffsets'][k] ) # offset
					l = ord( self.f.read(1) ) # text length

					if self.f.tell() + l > entry['dataOffset'] + entry['dataLength']:
						# print("INVALID LENGTH ON FIELD (" + str( num ) + ")")
						break

					data['castFieldData'].append( self.readString(l, False) ) # string data, unknown if there are other values
				
				# print( data['castFieldData'] )
				
				# cast name
				if len(data['castFieldData']) > 0:
					data['name'] = data['castFieldData'][0]

				self.f.seek( fieldStart + data['castDataLength'] )

			
			
			if data['castType'] == CastType.BITMAP.value: # bitmap

				# print( self.f.tell() )

				#data['imageUnknown1'] =
				self.readInt16(False) # unknown1

				# position on stage
				data['imagePosY'] = self.readInt16(False)
				data['imagePosX'] = self.readInt16(False)

				# to note with all of these, they're in "height, width" order
				heightRaw = self.readInt16(False)
				widthRaw = self.readInt16(False)

				# to get the proper width/height, the padding has to be subtracted off values, no idea what purpose it serves
				data['imageHeight'] = heightRaw - data['imagePosY']
				data['imageWidth'] = widthRaw - data['imagePosX']

				# no clue what this is
				#data['imageUnknown2'] = 
				self.readInt32(False)

				# neither this
				#data['imageUnknown3'] = 
				self.readInt32(False)

				# reg point, for having something else than 0,0 as the center, same subtracting stuff here
				regyRaw = self.readInt16(False)
				regxRaw = self.readInt16(False)

				data['imageRegY'] = regyRaw - data['imagePosY']
				data['imageRegX'] = regxRaw - data['imagePosX']

				# THE DATA ENDS HERE IF THE BITMAP IS 1-BIT

				data['imageBitAlpha'] = self.readByte(False) # not sure at all

				data['imageBitDepth'] = self.readByte(False)

				# unknown
				#data['imageUnknown4'] =
				self.readInt16(False)

				data['imagePalette'] = self.readInt16(False) # i have only seen -1 being used here

				if data['imageHeight'] < 0 or data['imageWidth'] < 0 or data['imageHeight'] > 2048 or data['imageWidth'] > 2048:
					print(data)
					raise Exception("Invalid image size, read error")
					return


			elif data['castType'] == CastType.SOUND.value:

				# codec
				if len(data['castFieldData']) >= 3:
					data['soundCodec'] = data['castFieldData'][2]

				data['soundCuePoints'] = {}

				data['soundLooped'] = data['castUnknown'][7] == 0

			elif data['castType'] == CastType.BUTTON.value:

				print(data['castFieldOffsets'])
				print(data['castFieldData'])

			elif data['castType'] == CastType.PALETTE.value:

				# no data
				data['noEndData'] = True

			else:

				self.log("Unhandled end data on cast type " + str( CastType( data['castType'] ) ) + ", offset " + str( entry['dataOffset'] ) )


		if entry['type'] == "KEY*":

			unknown1 = self.readInt16(self.BigEndian)
			unknown2 = self.readInt16(self.BigEndian)

			unknown3 = self.readInt32(self.BigEndian)

			entryNum = self.readInt32(self.BigEndian)

			# print("Key, " + str(entryNum) + " entries")

			for i in range(0, entryNum):

				# save offset
				kPos = self.f.tell()
				
				# slot in entries pointing to a file (bitd/snd/script ex.)
				castFileSlot = self.readInt32(self.BigEndian)

				# slot in entries pointing to the cast
				castSlot = self.readInt32(self.BigEndian)

				castType = self.readString(4, self.BigEndian)

				# self.log("[KEY " + str(i) + "] Link file entry #" + str( castFileSlot ) + " (" + str( castType ) + ") to #" + str( castSlot ) + " (o" + str(kPos) + ")" )

				if castSlot >= 1024:

					castNum = castSlot - 1024

					if castType in ("Lctx", "FXmp", "Cinf", "MCsL", "Sord", "VWCF", "VWFI", "VWLB", "VWSC", "Fmap", "SCRF", "DRCF", "VWFM", "VWtk"):

						self.log("[UNHANDLED KEY " + str(i) + "] Link file entry #" + str( castFileSlot ) + " (" + str( castType ) + ") to cast library " + str( castNum ) + " (" + str(castSlot) + ")" )

						#if not 'linkedEntries' in self.castLibraries[ castNum ]:
						#	self.castLibraries[ castNum ]['linkedEntries'] = []

						#self.castLibraries[ castNum ]['linkedEntries'].append( castFileSlot )

					elif castType == "CAS*":

						# self.log("[KEY " + str(i) + "] CASTLIB #" + str( castNum ) + " @ " + str(castFileSlot) )

						self.castLibraries[ castNum ]['libSlot'] = castFileSlot

					else:
						
						# self.log("[BIGKEY " + str(i) + "] Link file entry #" + str( castFileSlot ) + " (" + str( castType ) + ") to #" + str( castSlot ) + "" )
						
						self.fileEntries[ castSlot ]['linkedEntries'].append( castFileSlot )

				else:

					# self.log("[KEY " + str(i) + "] Link file entry #" + str( castFileSlot ) + " (" + str( castType ) + ") to #" + str( castSlot ) + "" )

					if castSlot > len(self.fileEntries):
						self.log("  INVALID KEY CAST SLOT: #" + str( castFileSlot ) + "->#" + str( castSlot ) + " (" + str( castType ) + ") @ " + str(kPos) )
						return
					elif castFileSlot > len(self.fileEntries):
						self.log("  INVALID KEY FILE SLOT: #" + str( castFileSlot ) + "->#" + str( castSlot ) + " (" + str( castType ) + ") @ " + str(kPos) )
						return
					else:
						self.fileEntries[ castSlot ]['linkedEntries'].append( castFileSlot )


		if entry['type'] == "CAS*":

			data['members'] = {}

			for i in range(0, round( entry['dataLength'] / 4 ) ): #two values, so divide by 4 (bytes)

				# cast slot is an int
				castSlot = self.readInt32(False)

				castNum = i + 1

				if castSlot == 0:
					continue

				# self.log("CAS* Num " + str(castNum) + ", Slot " + str(castSlot) )

				data['members'][ castNum ] = castSlot


		if entry['type'] == "snd ":

			if entry['dataLength'] == 0:
				return data

			formatNumber = self.readUInt16(False)

			print("SND Read")

			print( entry['dataOffset'] )			

			print("Format number: " + str(formatNumber))

			offset = entry['dataOffset'] + 8

			if formatNumber == 2:
				offset += 4


			self.f.seek(offset, 0)

			hasSoundCommand = self.readUInt16(False)

			if hasSoundCommand != 1:
				self.log("no sound command")
				return data

			soundCommand = self.f.read(2)

			bufferCommand = self.readUInt16(False)

			if bufferCommand != 0:
				self.log("buffercmd not 0")

			soundHeaderOffset = self.readUInt32(False)


			self.f.seek(soundHeaderOffset,1) # unknown

			data['soundSampleRate'] = self.readUInt16(False)

			self.f.seek(6,1)

			data['soundDataLength'] = self.readUInt32(False)

			self.f.seek(28,1) # unknown

			# print(self.f.tell())

			data['soundSampleSize'] = self.readUInt16(False)


		if entry['type'] == "sndH":

			self.f.seek(4,1) # unknown

			soundLength = self.readInt32(False)

			self.f.seek(4,1) # what

			self.f.seek(20,1) # null?

			self.f.seek(4,1) # sound length plus what

			self.f.seek(4,1) # sound length again?

			self.f.seek(4,1) # sound length again?

			sampleRate = self.readInt32(False)

			self.f.seek(4,1) # sample rate again?

			data['soundLength'] = soundLength
			data['soundSampleRate'] = sampleRate

		
		if entry['type'] == "cupt":

			cuptEntries = self.readInt32(False)

			data['soundCuePoints'] = []

			for i in range(0, cuptEntries):

				something = self.readInt16(False)

				sampleOffset = self.readInt16(False)

				textLength = self.readByte(False)

				if textLength > 0:

					cueName = self.readString(textLength, False)

				else:

					cueName = ""


				padLength = 31 - textLength

				self.f.seek(padLength, 1)

				data['soundCuePoints'].append([ sampleOffset, cueName ])


		# palette data
		if entry['type'] == 'CLUT':
			
			num = round( entry['dataLength'] / 6 )
			
			data['paletteData'] = []
			
			for p in range(0, num ):
				red1 = struct.unpack('B', self.f.read(1) )[0]
				red2 = struct.unpack('B', self.f.read(1) )[0]
				green1 = struct.unpack('B', self.f.read(1) )[0]
				green2 = struct.unpack('B', self.f.read(1) )[0]
				blue1 = struct.unpack('B', self.f.read(1) )[0]
				blue2 = struct.unpack('B', self.f.read(1) )[0]
				
				col = ( red1, green1, blue1 )
				
				data['paletteData'].append( col )

			# clut.close()

			data['paletteData'].reverse()


		# bitmap
		# if entry['type'] == 'BITD':
			# data['bitmap'] = 1

		return data


	def readBitd(self, offset, length, width, height, bitdepth):

		if bitdepth == 32:

			bitmapValues = [ [ [0,0,0,255] for x in range( width ) ] for y in range( height ) ]

		else:

			bitmapValues = [[0 for x in range( width )] for y in range( height )]

		print("W: " + str(width) + ", H: " + str(height))

		self.f.seek( offset, 0 )
		self.f.seek(8, 1) # fourcc, length

		# BITD PARSE
		draw_x = 0
		draw_y = 0
		readMode = 0

		channel = 0

		pad = 0
		if width % 2:
			pad = height

		if bitdepth > 32:
			readMode = 1

		if ( ( width * height ) + pad ) == length:
			readMode = 2

		#print("len: " + str( length ) )
		#print("whb: " + str( width * height ) )
		#print("bit: " + str( bitdepth ) )
		#print("pad: " + str( pad ) )

		#print("readMode: " + str(readMode))

		while self.f.tell() <= offset + length + 8:

			# bit field
			if readMode == 1: 

				msk = self.f.read(1)

				bt = bitstring.BitArray( msk ).bin

				i = 0
				for c in bt:

					bitmapValues[ draw_y ][ draw_x ] = 1 - int(c)

					draw_x += 1

					if draw_x >= width:
						draw_x = i-7 # 8-byte offset somehow

						draw_y += 1

					if draw_y >= height:
						return bitmapValues
						# break

					i += 1

			# direct palette
			elif readMode == 2:

				col = struct.unpack('B', self.f.read(1) )[0]

				bitmapValues[ draw_y ][ draw_x ] = 0xFF - col

				draw_x += 1

				if draw_x >= width:
					# print("reached line end at " + str( f.tell() - start ) )
					if pad:
						self.f.read(1) # padding byte?
					
					draw_x = 0
					draw_y += 1

				if draw_y >= height:
					# print("reached end at " + str( self.f.tell() - start ) )
					# break
					return bitmapValues

			# rle, lle
			else:

				rLen = struct.unpack('B', self.f.read(1) )[0]

				# print("Len: " + str(rLen) + " (" + str( 0x101 - rLen ) + "$" + str(0x7F) + "=" + str( 0x101 - rLen > 0x7F ) + ")" )				

				if 0x100 - rLen > 0x7F:

					rLen += 1

					for j in range(0, rLen):

						val = struct.unpack('B', self.f.read(1) )[0]

						#print(" Col: " + str(0xFF - val))
						
						if bitdepth == 32:

							bitmapValues[ draw_y ][ draw_x ][channel] = val

							draw_x += 1
							
							if draw_x >= width:
								
								channel = ( channel + 1 ) % 4

								draw_x = 0

								if channel == 0:
									draw_y += 1

						else:

							bitmapValues[ draw_y ][ draw_x ] = 0xFF - val

							draw_x += 1
							
							if draw_x >= width:

								if width % 2:
									draw_x = -1
								else:
									draw_x = 0

								draw_y += 1

						if draw_y >= height:
							#print("end lle")
							return bitmapValues


				else:

					rLen = 0x101 - rLen

					val = struct.unpack('B', self.f.read(1) )[0]

					for j in range(0, rLen):

						#print(" Col: " + str(0xFF - val))
						
						if bitdepth == 32:

							bitmapValues[ draw_y ][ draw_x ][channel] = val

							draw_x += 1
							
							if draw_x >= width:
								
								channel = ( channel + 1 ) % 4

								draw_x = 0

								if channel == 0:
									draw_y += 1

						else:

							bitmapValues[ draw_y ][ draw_x ] = 0xFF - val

							draw_x += 1

							if draw_x >= width:

								if width % 2:
									draw_x = -1
								else:
									draw_x = 0

								draw_y += 1


						if draw_y >= height:
							#print("end rle")
							return bitmapValues

		#print("end len")

		return bitmapValues



	def getCastMember(self, lib, num):

		for c in self.castLibraries:
			if c['name'] == lib:
				return c['members'][num]

		return False 


	def extractCastMember(self, lib, num, writeRaw, outPath, useName):

		global OPAQUE

		self.log("Extracting #" + str(num) + " in '" + str(lib) + "'...")

		for c in self.castLibraries:

			if c['name'] == lib:
				
				entry = c['members'][num]

				# print(entry)
				print( " Name: " + str( entry['name'] ) )
				print( " Type: " + str( entry['castType'] ) )
				print( " Base: " + str( self.baseName ) )

				outFileName = str(num)

				if useName:
					outFileName = entry['name']

				# make path
				#outPath = "cst_out_new/" + os.path.basename(self.fileName) + "/" + c['name']

				# raw cast file
				if writeRaw:
					self.f.seek( entry['dataOffset'] )
					cst = open( outPath + "/" + outFileName + ".cast", "wb")
					cst.write( self.f.read( entry['dataLength'] + 8 ) )
					cst.close()

				for li in entry['linkedEntries']:

					le = self.fileEntries[li]

					if entry['castType'] == CastType.SCRIPT.value:

						print("SCRIPT")

					if entry['castType'] == CastType.FIELD.value:

						if le["type"] == "STXT":

							self.f.seek( le['dataOffset'], 0 )
							self.f.seek(8, 1) # fourcc, length

							# unknown
							self.f.seek(4, 1)

							# length of the text
							textLength = self.readInt32(False)

							# data at the end of the content, no idea what
							textPadding = self.readInt32(False)

							# read text content
							textContent = self.f.read( textLength )
							
							# write text
							fileName = outPath + "/" + outFileName + ".txt"
							txts = open( fileName, "wb")
							txts.write( textContent )
							txts.close()

							# entry['text'] = textContent.decode('ansi')
							if not lib in self.textContents:
								self.textContents[lib] = {}

							self.textContents[lib][num] = textContent.decode('ansi')


					if entry['castType'] == CastType.SOUND.value:

						if le["type"] == "sndS":

							self.f.seek( le['dataOffset'], 0 )
							self.f.seek(8, 1) # fourcc, length

							outWav = wave.open( outPath + "/" + outFileName + ".wav", "wb")
							outWav.setnchannels(1)
							outWav.setsampwidth(1)
							outWav.setframerate( entry['soundSampleRate'] )
							outWav.writeframes( self.f.read( le['dataLength'] ) )
							outWav.close()

							# call("ffmpeg -i " + outPath + "/" + outFileName + ".wav -y -c:a libvorbis -b:a 64k " + outPath + "/" + outFileName + ".ogg")

							sndMeta = {
								"name": entry["name"],
								"length": le['dataLength'],
								"rate": entry['soundSampleRate'],
								"cue": entry["soundCuePoints"]
							}

							sndMetaJSON = open( outPath + "/" + outFileName + ".json", "w")
							sndMetaJSON.write( json.dumps( sndMeta ) )
							sndMetaJSON.close()


							'''
								if entry['soundCodec'] == "kMoaCfFormat_snd":

									aBytes = self.f.read( le['dataLength'] )
									#rBytes = bytes([c for t in zip(aBytes[1::2], aBytes[::2]) for c in t])
									rBytes = aBytes

									outAu = sunau.open( outPath + "/" + outFileName + ".au", "wb")
									outAu.setnchannels(1)
									outAu.setsampwidth(1)
									outAu.setcomptype('NONE','')
									outAu.setframerate( entry['soundSampleRate'] )
									outAu.writeframesraw( rBytes )
									outAu.close()
								
								elif entry['soundCodec'] == "kMoaCfFormat_WAVE":
									
									outWav = wave.open( outPath + "/" + outFileName + ".wav", "wb")
									outWav.setnchannels(1)
									outWav.setsampwidth(1)
									outWav.setframerate( entry['soundSampleRate'] )
									outWav.writeframes( self.f.read( le['dataLength'] ) )
									outWav.close()

									call("ffmpeg -i " + outPath + "/" + outFileName + ".wav -y -c:a libvorbis -b:a 64k " + outPath + "/" + outFileName + ".ogg")
								
								elif entry['soundCodec'] == "kMoaCfFormat_AIFF":
									
									outAiff = aifc.open( outPath + "/" + outFileName + ".aifc", "wb")
									outAiff.aifc()
									outAiff.setnchannels(1)
									outAiff.setsampwidth(1)
									outAiff.setframerate( entry['soundSampleRate'] )

									for ci, cp in enumerate(entry["soundCuePoints"]):
										outAiff.setmark(ci+1, cp[0], cp[1].encode() )

									outAiff._comptype = b'raw '
									outAiff._compname = b'' 

									outAiff.writeframes( self.f.read( le['dataLength'] ) )

									outAiff.close()

									call("ffmpeg -i " + outPath + "/" + outFileName + ".aifc -y -c:a libvorbis -b:a 64k " + outPath + "/" + outFileName + ".ogg")

								else:

									self.log("Unknown audio format")

							'''

							# print(entry["soundCodec"])

							# print(entry["soundCuePoints"])


						if le["type"] == "snd " and le["dataLength"] > 0:

							#self.log("UNHANDLED SOUND")
							#print( le["dataOffset"] )
							#print( le["dataLength"] )

							self.f.seek( le['dataOffset'] + 8 + 78, 0 )
							#self.f.seek(8, 1) # fourcc, length

							#self.f.seek(34,1) # metadata

							# print( entry['soundSampleSize'] )		
							
							outWav = wave.open( outPath + "/" + outFileName + ".wav", "wb")
							
							outWav.setnchannels(1)
							
							outWav.setsampwidth( int( entry['soundSampleSize'] / 8 ) )
							
							outWav.setframerate( entry['soundSampleRate'] )

							# print( entry['soundDataLength'] )

							aBytes = self.f.read( entry['soundDataLength'] )

							# reverse bytes - https://stackoverflow.com/a/14543975
							rBytes = bytes([c for t in zip(aBytes[1::2], aBytes[::2]) for c in t])

							outWav.writeframes( rBytes )

							outWav.close()
							
							'''
							self.f.seek( le['dataOffset'], 0 )
							self.f.seek(8, 1) # fourcc, length

							outSnd = open( outPath + "/" + outFileName + ".snd", "wb")
							outSnd.write( self.f.read( le['dataLength'] ) )
							outSnd.close()
							'''


					if entry['castType'] == CastType.BITMAP.value:

						if le["type"] == "BITD":

						
							self.f.seek( le['dataOffset'], 0 )
							self.f.seek(8, 1) # fourcc, length

							bitmapValues = self.readBitd(le['dataOffset'], le['dataLength'], entry["imageWidth"], entry["imageHeight"], entry["imageBitDepth"])

							entry["imageHash"] = hash( str(bitmapValues) )

							# save to bitmap
							if entry["imageBitDepth"] == 32:
								im = Image.new("RGB", (entry["imageWidth"], entry["imageHeight"]) )

							elif entry["imageBitDepth"] > 32:
								im = Image.new("1", (entry["imageWidth"], entry["imageHeight"]) ) # 1-bit 0/1 image
							
							else:

								im = Image.new("P", (entry["imageWidth"], entry["imageHeight"]) ) # 8-bit palette image

								ip = entry['imagePalette']

								pal = []

								# cast palette
								if ip >= 1:

									paletteCast = self.getCastMember( entry['castLibrary'], ip )

									if not 'paletteData' in paletteCast:

										self.log("!!! NO PALETTE DATA IN CAST " + str(ip))

									else:

										for pc in paletteCast['paletteData']:
											pal.append(pc[0])
											pal.append(pc[1])
											pal.append(pc[2])

									# print(paletteCast)

								else:

									ip = -ip

									if ip == 100:
										# built in windows palette (dir 4)
										for b in range(0,255):
											l = b * 4
											pal.append( PALETTE_WIN[l+2] )
											pal.append( PALETTE_WIN[l+1] )
											pal.append( PALETTE_WIN[l] )

									if ip == 0:
										# built in mac palette
										for b in range(0,255):
											l = b * 4
											pal.append( PALETTE_MAC[l+2] )
											pal.append( PALETTE_MAC[l+1] )
											pal.append( PALETTE_MAC[l] )

								im.putpalette( pal )


							dr = ImageDraw.Draw(im)

							x = 0
							y = 0
							for y in range( 0, entry["imageHeight"]  ):
								for x in range( 0, entry["imageWidth"] ):

									if entry["imageBitDepth"] == 32:

										# print(bitmapValues[y][x])

										dr.point( (x, y), ( bitmapValues[y][x][1], bitmapValues[y][x][2], bitmapValues[y][x][3] ) )

									else:

										dr.point( (x, y), bitmapValues[y][x] )
									
							
							im.save( "C:/temp/swp.bmp", "BMP")
							# im.save( outPath + "/" + outFileName + ".bmp", "BMP")

							# regs = str(entry["imageRegX"]) + "x" + str(entry["imageRegY"])

							#if entry["imageWidth"] > 390 or entry["imageHeight"] > 390:
							if self.baseName in OPAQUE and num in OPAQUE[self.baseName]:
								print("Opaque!")
								call("magick convert C:/temp/swp.bmp " + outPath + "/" + outFileName + ".png")
								# call("magick convert " + outPath + "/" + outFileName + ".bmp " + outPath + "/" + outFileName + ".png")
							else:
								print("Translucent!")
								call("magick convert C:/temp/swp.bmp -transparent \"#FFFFFF\" " + outPath + "/" + outFileName + ".png")
								# call("magick convert " + outPath + "/" + outFileName + ".bmp -transparent \"#FFFFFF\" " + outPath + "/" + outFileName + ".png")


							imMeta = {
								"name": entry["name"],
								"pivotX": entry["imageRegX"],
								"pivotY": entry["imageRegY"],
								"hash": entry["imageHash"]
							}

							imMetaJSON = open( outPath + "/" + outFileName + ".json", "w")
							imMetaJSON.write( json.dumps( imMeta ) )
							imMetaJSON.close()


							del dr

					if writeRaw:
						fExt = {"snd ": "snd_", "sndH": "sndH", "BITD": "BITD", "THUM": "THUM", "CLUT": "CLUT", "sndS": "sndS"}
						self.f.seek( le['dataOffset'], 0 )
						self.f.seek(8, 1) # fourcc, length
						outRaw = open( outPath + "/" + outFileName + "." + fExt[ le['type'] ], "wb")
						outRaw.write( self.f.read( le['dataLength'] ) )
						outRaw.close()
				

				if entry['castType'] == CastType.PALETTE.value:

					'''
					# Adobe Color File
					outAco = open( outPath + "/" + outFileName + ".aco", "wb")

					outAco.write( struct.pack('>h', 1) )

					outAco.write( struct.pack('>h', len(entry['paletteData']) ) )
					
					for p in entry['paletteData']:

						outAco.write( struct.pack('>H', 0) ) # nc
						outAco.write( struct.pack('>H', p[0] * 256 ) ) # w
						outAco.write( struct.pack('>H', p[1] * 256 ) ) # x
						outAco.write( struct.pack('>H', p[2] * 256 ) ) # y
						outAco.write( struct.pack('>H', 0) ) # z

					outAco.close()
					'''

					# Palette file
					outPal = open( outPath + "/" + outFileName + ".pal", "wb")

					outPal.write( "PAL ".encode() ) # header

					outPal.write( struct.pack('I', ( len(entry['paletteData']) * 4 ) + 2 + 2 ) ) # file length

					outPal.write( struct.pack('H', 0x0300) ) # version

					outPal.write( struct.pack('H', len(entry['paletteData']) ) ) # colour count
					
					for p in entry['paletteData']:
						outPal.write( struct.pack('B', p[0] ) )
						outPal.write( struct.pack('B', p[1] ) )
						outPal.write( struct.pack('B', p[2] ) )
						outPal.write( struct.pack('B', 0) ) # flags

					outPal.close()



		self.log("Done.\n")

		return False