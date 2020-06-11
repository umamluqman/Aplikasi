from django.urls import include, path
from cuti.api import AgendaList, AgendaDetail, agendaBulkDelete, streaming_agenda_csv_view, create_surat_ck_request, create_surat_kk_request
from rest_framework import routers

appname = 'agenda'

urlpatterns = [
    path('api/agenda/', AgendaList, name='agenda-list'),
    path('api/agenda/<int:pk>', AgendaDetail, name='agenda-detail'),
    path('api/bulk-delete-agenda', agendaBulkDelete, name='bulk-delete-agenda'),
    path('api/agenda-csv', streaming_agenda_csv_view, name='get-agenda-csv'),
    path('api/create-kk', create_surat_kk_request, name='create-kk'),
    path('api/create-ck', create_surat_ck_request, name='create-ck'),
]
