from rest_framework import serializers
from cuti.models import Agenda
from accounts.serializers import UserSimpleSerializer


class ExportCsvSerializer(serializers.Serializer):
    bulan = serializers.IntegerField(allow_null=True, required=False)
    tahun = serializers.IntegerField()


class CreateSuratSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agenda
        fields = ('jenis_surat',)


class AgendaListSerializer(serializers.ModelSerializer):
    user = UserSimpleSerializer(read_only=True)

    class Meta:
        model = Agenda
        fields = (
            'no_surat',
            'tgl_surat',
            'jenis_surat',
            'user'
        )

    def create(self, validated_data):
        agenda = Agenda.objects.create(
            **validated_data,
            user=self.context['request'].user
        )

        return agenda


class AgendaDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = Agenda
        fields = (
            'no_surat',
            'tgl_surat',
            'jenis_surat',
        )

    def create(self, validated_data):
        agenda = Agenda.objects.create(
            **validated_data,
            user=self.context['request'].user
        )

        return agenda
