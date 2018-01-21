# -*- coding: utf-8 -*-

from django import forms

class FileFieldForm(forms.Form):
    docfile = forms.FileField(widget=forms.ClearableFileInput(attrs={'multiple': True}))
