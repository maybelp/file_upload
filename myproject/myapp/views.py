# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.template import RequestContext
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.core.mail import EmailMessage
from myproject.myapp.models import Document
from myproject.myapp.forms import FileFieldForm


def main(request):
    """
    Handles file upload
    """
    
    #If there is a post request upload upload recieved files
    if request.method == 'POST':
        form = FileFieldForm(request.POST, request.FILES)

        if form.is_valid():
            url_list = []

            for file in request.FILES.getlist('docfile'):
                newdoc = Document(docfile=file)
                newdoc.save()
                #get the full absoute url
                file_url = request.build_absolute_uri(newdoc.docfile.url)
                file_name = file.name 
                url_list.append(file_name + ": |"+ file_url)

                # HERE IS WHERE YOU NEED TO PROGRAM 
            # Redirect to the thank tou page after this
            email_string = " /n".join(url_list)
            email = EmailMessage('Subject', email_string, to=['maybelp2006@gmail.com', 'jobs@mercurytide.co.uk'])
           
            email.send()
          
            # TODO: write email sending code here
            return HttpResponseRedirect(reverse('thanks'))


    # If its not a post request just get 10 most recent
    # files from the database
    form = FileFieldForm()  # A empty, unbound form
    # Load documents for the list page (show only top 10 docs)
    documents = (
        Document.objects.all() if len(Document.objects.all()) < 10
        else  Document.objects.all()[len(Document.objects.all())-10:]
    )

    # Render list page with the documents and the form
    return render(
        request,
        'list.html',
        {'documents': documents, 'form': form}
    )

def thanks(request):
    return render(
        request,
        'thank_you.html'
    )
