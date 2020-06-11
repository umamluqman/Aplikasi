from django.db import models
from django.contrib.auth.models import AbstractUser
import datetime

# Create your models here.
JENIS_KELAMIN_CHOICES = (
    ('L', 'Laki-Laki'),
    ('P', 'Perempuan')
)

AGAMA_CHOICES = (
    ('Islam', 'Islam'),
    ('Kristen', 'Kristen'),
    ('Budha', 'Budha'),
    ('Hindu', 'Hindu'),
    ('Konghucu', 'Konghucu')
)

JURUSAN_CHOICE = (
    ('IF', 'INFORMATIKA'),
    ('SI', 'SISTEM INFORMASI')
)


class CustomUser(AbstractUser):
    nim = models.TextField(max_length=10, primary_key=True, blank=True)
    nama = models.TextField(max_length=50)
    tempat_lahir = models.TextField(max_length=50)
    tanggal_lahir = models.DateField(null=True)
    jenis_kelamin = models.CharField(
        choices=JENIS_KELAMIN_CHOICES,
        max_length=1
    )
    agama = models.TextField(
        choices=AGAMA_CHOICES,
        max_length=10
    )
    jurusan = models.TextField(
        choices=JURUSAN_CHOICE,
        max_length=2,
        null=True
    )
    tahun_masuk = models.TextField(
        max_length=12,
        null=True
    )
    semester = models.IntegerField(null=True)
    is_staff = models.BooleanField(default=False)

# python manage.py importcsv --mappings='1=nim,2=nama,3=username,4=email,5=tempat_lahir,6=tanggal_lahir,7=jenis_kelamin,8=agama,9=jurusan,10=tahun_masuk,11=semester' --model='accounts.CustomUser' ~/Desktop/backup.csv
