from rest_framework import serializers, permissions
from django.contrib.auth import authenticate
from rest_framework import serializers
from accounts.models import CustomUser
from django.contrib.auth.password_validation import validate_password


class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for password change endpoint.
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_new_password(self, value):
        validate_password(value)
        return value


class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = (
            'nama',
            'username',
            'email',
            'tempat_lahir',
            'tanggal_lahir',
            'jenis_kelamin',
            'agama',
            'jurusan',
            'tahun_masuk',
            'semester'
        )


class CheckUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = (
            'nim',
            'nama',
            'username',
            'email',
            'tempat_lahir',
            'tanggal_lahir',
            'jenis_kelamin',
            'agama',
            'jurusan',
            'tahun_masuk',
            'semester',
            'is_staff'
        )


class UserSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = (
            'nim',
            'nama',
            'jurusan',
            'tahun_masuk',
            'semester',
        )


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = (
            'nim',
            'nama',
            'username',
            'email',
            'tempat_lahir',
            'tanggal_lahir',
            'jenis_kelamin',
            'agama',
            'jurusan',
            'tahun_masuk',
            'semester',
        )


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = (
            'nim',
            'nama',
            'username',
            'password',
            'email',
            'tempat_lahir',
            'tanggal_lahir',
            'jenis_kelamin',
            'agama',
            'jurusan',
            'tahun_masuk',
            'semester',
        )
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validate_data):
        user = CustomUser.objects.create_user(
            **validate_data
        )

        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)

        if user and user.is_active:
            return user

        raise serializers.ValidationError("Incorrect Credential")


class ExportCsvSerializer(serializers.Serializer):
    tahun_masuk = serializers.IntegerField()
