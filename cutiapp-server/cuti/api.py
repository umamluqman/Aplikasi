import csv
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions, status
from cuti.serializers import AgendaDetailSerializer, AgendaListSerializer, ExportCsvSerializer, CreateSuratSerializer
from cuti.models import Agenda
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.http import StreamingHttpResponse, HttpResponse
from rest_framework.settings import api_settings
from django.db.models import Q
from cuti.utils import create_ck, create_kk


@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def AgendaList(request):
    if request.method == 'GET':
        pagination_class = api_settings.DEFAULT_PAGINATION_CLASS
        paginator = pagination_class()
        queryset = Agenda.objects.all().order_by('-no_surat')
        page = paginator.paginate_queryset(queryset, request)
        serializer = AgendaListSerializer(page, many=True)

        return paginator.get_paginated_response(serializer.data)

    if request.method == 'POST':
        serializer = AgendaDetailSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['PUT', 'GET', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def AgendaDetail(request, *args, **kwargs):
    if request.method == 'PUT':
        pk = kwargs['pk']
        agenda = get_object_or_404(Agenda, no_surat=pk)
        serializer = AgendaDetailSerializer(
            agenda,
            data=request.data
        )
        if serializer.is_valid():
            serializer.save()
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'GET':
        pk = kwargs['pk']
        agenda = Agenda.objects.filter(no_surat=pk)
        if agenda:
            serializer = AgendaListSerializer(agenda[0])
            return Response({
                'count': 1,
                'results': [
                    {**serializer.data}
                ]
            })
        else:
            return Response({
                'count': 0,
                'results': []
            })

    if request.method == 'DELETE':
        pk = kwargs['pk']
        agenda = get_object_or_404(Agenda, no_surat=pk)
        agenda.delete()
        return Response(status=status.HTTP_200_OK)


@api_view(['DELETE'])
@permission_classes([permissions.IsAdminUser])
def agendaBulkDelete(request):
    surats = request.data
    try:
        delete = Agenda.objects.filter(no_surat__in=surats).delete()
        return Response(status=status.HTTP_200_OK)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)


class Echo:
    """An object that implements just the write method of the file-like
    interface.
    """

    def write(self, value):
        """Write the value by returning it, instead of storing in a buffer."""
        return value


def get_headers():
    return ['no_surat', 'tgl_surat', 'jenis_surat', 'nim', 'nama', 'jurusan', 'tahun_masuk', 'semester']


def get_data(item):
    return {
        'no_surat': item.no_surat,
        'tgl_surat': item.tgl_surat,
        'jenis_surat': item.jenis_surat,
        'nim': item.user.nim,
        'nama': item.user.nama,
        'jurusan': item.user.jurusan,
        'tahun_masuk': item.user.tahun_masuk,
        'semester': item.user.semester
    }


def iter_items(items, pseudo_buffer):
    writer = csv.DictWriter(pseudo_buffer, fieldnames=get_headers())
    yield writer.writerow({
        'no_surat': 'no_surat',
        'tgl_surat': 'tgl_surat',
        'jenis_surat': 'jenis_surat',
        'nim': 'nim',
        'nama': 'nama',
        'jurusan': 'jurusan',
        'tahun_masuk': 'tahun_masuk',
        'semester': 'semester'
    })

    for item in items:
        yield writer.writerow(get_data(item))


@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def streaming_agenda_csv_view(request):
    """A view that streams a large CSV file."""
    serialize = ExportCsvSerializer(data=request.data)
    serialize.is_valid(raise_exception=True)
    data = serialize.data

    if (data['bulan']):
        agenda = Agenda.objects.filter(
            Q(tgl_surat__month=data['bulan']) & Q(
                tgl_surat__year=data['tahun'])
        ).order_by('-no_surat')
    else:
        agenda = Agenda.objects.filter(
            Q(tgl_surat__year=data['tahun'])
        ).order_by('-no_surat')

    if len(agenda):
        response = StreamingHttpResponse(
            streaming_content=(iter_items(agenda, Echo())),
            content_type="text/csv"
        )
        response['Content-Disposition'] = 'attachment; filename="somefilename.csv"'
        return response
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def create_surat_kk_request(request):
    serializer = AgendaDetailSerializer(
        data=request.data,
        context={'request': request}
    )
    serializer.is_valid(raise_exception=True)
    data = serializer.save()

    filename = "kk"
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="' + \
        filename + '.pdf"'
    create_kk(response, data)
    return response


@api_view(['POST'])
def create_surat_ck_request(request):

    serializer = AgendaDetailSerializer(
        data=request.data,
        context={'request': request}
    )
    serializer.is_valid(raise_exception=True)
    data = serializer.save()
    filename = "ck"
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="' + \
        filename + '.pdf"'
    create_ck(response, data)
    return response
