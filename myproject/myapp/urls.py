# -*- coding: utf-8 -*-
from django.conf.urls import url
from myproject.myapp.views import main, thanks

urlpatterns = [
    url(r'^main/$', main, name='main'),
    url(r'^main/thanks$', thanks, name='thanks')
]
