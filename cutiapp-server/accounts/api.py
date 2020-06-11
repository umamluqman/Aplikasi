import csv
from accounts.serializers import UpdateUserSerializer, UserSerializer, RegisterSerializer, LoginSerializer, CheckUserSerializer, ExportCsvSerializer, ChangePasswordSerializer
from rest_framework.response import Response
from knox.models import AuthToken
from accounts.models import CustomUser
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions, status
from django.shortcuts import get_object_or_404
from rest_framework.settings import api_settings
from django.http import StreamingHttpResponse, HttpResponse
from django.db.models import Q


@api_view(['POST', 'GET'])
@permission_classes([permissions.IsAdminUser])
def userListApi(request):
    if request.method == 'GET':
        pagination_class = api_settings.DEFAULT_PAGINATION_CLASS
        paginator = pagination_class()
        queryset = CustomUser.objects.filter(is_staff=False).order_by('nim')
        page = paginator.paginate_queryset(queryset, request)
        serializer = UserSerializer(page, many=True)

        return paginator.get_paginated_response(serializer.data)

    if request.method == 'POST':
        data = request.data
        serializer = RegisterSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def loginApi(request):
    data = request.data
    serializer = LoginSerializer(data=data)
    serializer.is_valid(raise_exception=True)
    user = serializer.validated_data
    _, token = AuthToken.objects.create(user)

    serializer_class = LoginSerializer
    return Response({
        'user': CheckUserSerializer(user).data,
        'token': token
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def userApi(request):
    user = CheckUserSerializer(request.user).data
    return Response(user)


@api_view(['PUT', 'GET', 'DELETE'])
@permission_classes([permissions.IsAdminUser])
def userDetailApi(request, *args, **kwargs):
    if request.method == 'GET':
        nim = kwargs['pk']
        user = CustomUser.objects.filter(nim=nim)
        if user:
            serializer = UserSerializer(user[0])
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

    if request.method == 'PUT':
        nim = kwargs['pk']
        user = get_object_or_404(CustomUser, nim=nim)
        serializer = UpdateUserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                serializer.data,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        nim = kwargs['pk']
        user = get_object_or_404(CustomUser, nim=nim)
        user.delete()
        return Response(status=status.HTTP_200_OK)


@api_view(['DELETE'])
@permission_classes([permissions.IsAdminUser])
def userBulkDelete(request):
    users = request.data
    try:
        delete = CustomUser.objects.filter(nim__in=users).delete()
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
    return ['nim', 'nama', 'username', 'email', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin', 'agama', 'jurusan', 'tahun_masuk', 'semester']


def get_data(item):
    return {
        'nim': item.nim,
        'nama': item.nama,
        'username': item.username,
        'email': item.email,
        'tempat_lahir': item.tempat_lahir,
        'tanggal_lahir': item.tanggal_lahir,
        'jenis_kelamin': item.jenis_kelamin,
        'agama': item.agama,
        'jurusan': item.jurusan,
        'tahun_masuk': item.tahun_masuk,
        'semester': item.semester,
    }


def iter_items(items, pseudo_buffer):
    writer = csv.DictWriter(pseudo_buffer, fieldnames=get_headers())
    yield writer.writerow({
        'nim': 'nim',
        'nama': 'nama',
        'username': 'username',
        'email': 'email',
        'tempat_lahir': 'tempat_lahir',
        'tanggal_lahir': 'tanggal_lahir',
        'jenis_kelamin': 'jenis_kelamin',
        'agama': 'agama',
        'jurusan': 'jurusan',
        'tahun_masuk': 'tahun_masuk',
        'semester': 'semester',
    })

    for item in items:
        yield writer.writerow(get_data(item))


@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def streaming_users_csv_view(request):
    """A view that streams a large CSV file."""
    serialize = ExportCsvSerializer(data=request.data)
    serialize.is_valid(raise_exception=True)
    users = CustomUser.objects.filter(
        Q(is_staff=False) &
        Q(tahun_masuk=serialize.data['tahun_masuk'])
    ).order_by('nim')

    if len(users):
        response = StreamingHttpResponse(
            streaming_content=(iter_items(users, Echo())),
            content_type="text/csv"
        )
        response['Content-Disposition'] = 'attachment; filename="somefilename.csv"'
        return response
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def updatePassword(request):
    user = request.user
    serializer = ChangePasswordSerializer(data=request.data)

    if serializer.is_valid():
        old_password = serializer.data.get("old_password")
        if not user.check_password(old_password):
            return Response(
                {"old_password": ["Wrong password."]},
                status=status.HTTP_400_BAD_REQUEST
            )
        user.set_password(serializer.data.get("new_password"))
        user.save()
        return Response(status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
