from django.db import models
from django.conf import settings
from accounts.models import CustomUser
# Create your models here.

# jenis surat: keterangan kuliah, cuti kuliah
JENIS_SURAT_CHOISES = (
    ('KK', 'Keterangan Kuliah'),
    ('CK', 'Cuti Kuliah')
)


class Agenda(models.Model):
    no_surat = models.AutoField(primary_key=True, )
    tgl_surat = models.DateField(auto_now=True)
    jenis_surat = models.CharField(choices=JENIS_SURAT_CHOISES, max_length=2)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        to_field='nim',
        related_name='surats',
        on_delete=models.CASCADE
    )
