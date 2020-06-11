from datetime import datetime
from datetime import date
from reportlab.lib.units import mm
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Spacer, Paragraph, Image
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet

pembilang = {
    1: 'Satu',
    2: 'Dua',
    3: 'Tiga',
    4: 'Empat',
    5: 'Lima',
    6: 'Enam',
    7: 'Tujuh',
    8: 'Delapan',
}

jurusan_choices = {
    "IF": "Informatika",
    "SI": "Sistem Informasi"
}


def str_num(number):
    if len(str(number)) == 1:
        return "0{}".format(number)
    else:
        return str(number)


bulan = {
    1: 'Januari',
    2: 'Februari',
    3: 'Maret',
    4: 'April',
    5: 'Mei',
    6: 'Juni',
    7: 'Juli',
    8: 'Agustus',
    9: 'September',
    10: 'Oktober',
    11: 'November',
    12: 'Desember',
}


def addYears(d, years):
    try:
        return d.replace(year=d.year + years)
    except ValueError:
        return d + (date(d.year + years, 1, 1) - date(d.year, 1, 1))

conv = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [ 100, 'C'], [ 90, 'XC'], [ 50, 'L'], [ 40, 'XL'],
    [  10, 'X'], [  9, 'IX'], [  5, 'V'], [  4, 'IV'],
    [   1, 'I']]

def to_roman(number):
    roman = ''
    i = 0
    while number > 0:
        while conv[i][0] > number:
            i += 1
        roman += conv[i][1]
        number -= conv[i][0]
    return roman


def create_header():
    styles = getSampleStyleSheet()

    logo = Image('static/logo.png', 30*mm, 30*mm)
    hp1 = 'UNIVERSITAS BALE BANDUNG'
    hp2 = 'FAKULTAS TEKNOLOGI INFORMASI'
    hp3 = 'PROGRAM STUDI : TEKNIK INFORMATIKA DAN'
    hp4 = '                     SISTEM INFORMASI'

    header_skelecton = [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0]
    ]

    header_skelecton[0][0] = logo
    header_skelecton[0][1] = hp1
    header_skelecton[1][1] = hp2
    header_skelecton[2][1] = hp3
    header_skelecton[3][1] = hp4

    header = Table(
        header_skelecton,
        colWidths=(
            35*mm, '100%'
        ),
        rowHeights=(
            12.5*mm, 7.5*mm, 5*mm, 5*mm
        )
    )

    header_style = TableStyle([
        ('SPAN', (0, 0), (0, -1)),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),

        ('FONT', (1, 0), (1, 0), 'Times-Bold', 24),
        ('FONT', (1, 1), (1, 1), 'Times-Bold', 16),
        ('FONT', (1, 2), (1, -1), 'Times-Bold', 10),
    ])

    header.setStyle(header_style)

    return header


def create_spacer():
    spacer_table = Table(
        [['JL. R.A.A WIRANTAKUSUMAH No.7 BALEENDAH KAB. BANDUNG 40258 Tlp.022-5946443,5949921,Fax.022-5940443']],
        colWidths=(
            '100%'
        ),
        rowHeights=(
            6*mm
        )
    )

    spacer_style = TableStyle([

        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONT', (0, 0), (-1, -1), 'Times-Bold', 9.7),
        ('LINEABOVE', (0, 0), (-1, -1), 1, colors.black),
        ('LINEABOVE', (0, 0), (1, 1), 1, colors.black),

    ])

    spacer_table.setStyle(spacer_style)
    return spacer_table


def create_kk(response, data):
    no_surat = str_num(data.no_surat)
    bulan_surat = to_roman(data.tgl_surat.month)
    tahun_surat = data.tgl_surat.year
    tempat_surat = "Baleendah"
    dekan = "Yudi Herdiana S.T.,M.T"
    nik = "04104808008"
    nama = data.user.nama
    nim = data.user.nim
    jurusan = jurusan_choices[data.user.jurusan]
    semester = pembilang[data.user.semester]
    tahun_akademik = "{}-{}".format(datetime.now().year,
                                    addYears(datetime.now(), 1).year)
    tanggal_sekarang = "{} {} {}".format(
        data.tgl_surat.day, bulan[data.tgl_surat.month], data.tgl_surat.year)

    doc = SimpleDocTemplate(
        response,
        pagesize=A4,
        topMargin=24,
        rightMargin=32,
        bottomMargin=24,
        leftMargin=32,
    )

    styles = getSampleStyleSheet()

    header = create_header()
    spacer_table = create_spacer()

    story = []

    for char in "12":
        i = 0
        while i < len(conv):
            if int(char) == int(conv[i][0]):
                print(conv[i][1])
                i += 1
            else:
                i += 1

    story.append(header)
    story.append(Spacer(1, 2.5 * mm))
    story.append(spacer_table)
    story.append(Spacer(1, 12 * mm))
    story.append(Paragraph(
        "<para fontSize=14 fontName='Times-Bold' alignment='center'><u>SURAT KETERANGAN KULIAH</u></para>", styles['Normal']))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(
        "<para fontSize=12 fontName='Times' alignment='center'>Nomor : {}/KK/FTI-UNIBBA/{}/{}</para>".format(no_surat, bulan_surat, tahun_surat), styles['Normal']))
    story.append(Spacer(1, 12 * mm))
    story.append(Paragraph(
        "<para fontSize=12 fontName='Times'>Yang bertanda tangan di bawah ini :</para>", styles['Normal']))
    story.append(Spacer(1, 12 * mm))
    story.append(Paragraph(
        "<para fontSize=12 fontName='Times'>Nama{}: {}</para>".format('&nbsp;' * 30, dekan), styles['Normal']))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(
        "<para fontSize=12 fontName='Times'>NIK{}: {}</para>".format('&nbsp;' * 32, nik), styles['Normal']))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(
        "<para fontSize=12 fontName='Times'>Jabatan{}: Dekan</para>".format('&nbsp;' * 27), styles['Normal']))
    story.append(Spacer(1, 12 * mm))
    story.append(Paragraph(
        "<para fontSize=12 fontName='Times'>Dengan ini menyatakan sesungguhnya bahwa : </para>", styles['Normal']))
    story.append(Spacer(1, 12 * mm))
    story.append(Paragraph(
        "<para fontSize=12 fontName='Times'>Nama{}: {}</para>".format('&nbsp;' * 29, nama), styles['Normal']))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(
        "<para fontSize=12 fontName='Times'>NIM{}: {}</para>".format('&nbsp;' * 31, nim), styles['Normal']))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(
        "<para fontSize=12 fontName='Times'>Tahun Akademik{}: {}</para>".format('&nbsp;' * 11, tahun_akademik), styles['Normal']))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(
        "<para fontSize=12 fontName='Times'>Program Studi{}: {}</para>".format('&nbsp;' * 16, jurusan), styles['Normal']))
    story.append(Spacer(1, 12 * mm))
    story.append(Paragraph(
        "<para fontSize=12 fontName='Times'>Tercatat sebagai Mahasiswa pada Fakultas Teknologi Informasi Universitas Bale Bandung (UNIBBA).</para>", styles['Normal']))
    story.append(Spacer(1, 12 * mm))
    story.append(Paragraph(
        "<para fontSize=12 fontName='Times'>Demikian Surat Keterangan ini dibuat dengan sesunguhnya untuk dipergunakan sebagaimana mestinya, kepada pihak yang terkait mohon maklum adanya dan kami ucapkan terima kasih.</para>", styles['Normal']))
    story.append(Spacer(1, 12 * mm))

    ttd_skelecton = [
        ['', "Baleendah, {}".format(tanggal_sekarang)],
        ['', 'Dekan,'],
        ['', ''],
        ['', dekan],
        ['', 'NIK. {}'.format(nik)],
    ]

    ttd = Table(
        ttd_skelecton,
        colWidths=(
            '100%', 60*mm
        ),
        rowHeights=(
            5*mm, 5*mm, 20*mm, 5*mm, 5*mm
        )
    )

    ttd_style = TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONT', (0, 0), (-1, -1), 'Times-Roman', 12)
    ])

    ttd.setStyle(ttd_style)

    story.append(ttd)
    doc.build(story)


def create_ck(request, data):

    tempat_surat = "Baleendah"
    dekan = "Yudi Herdiana S.T.,M.T"
    nik = "04104808008"
    nama = data.user.nama
    nim = data.user.nim
    jurusan = jurusan_choices[data.user.jurusan]
    semester = "{} ({})".format(data.user.semester, pembilang[data.user.semester])
    tanggal_sekarang = "{} {} {}".format(
        data.tgl_surat.day, bulan[data.tgl_surat.month], data.tgl_surat.year)

    doc = SimpleDocTemplate(
        request,
        pagesize=A4,
        topMargin=24,
        rightMargin=32,
        bottomMargin=18,
        leftMargin=32,
    )

    styles = getSampleStyleSheet()

    header = create_header()
    spacer_table = create_spacer()

    story = []

    story.append(header)
    story.append(Spacer(1, 2.5 * mm))
    story.append(spacer_table)
    story.append(Spacer(1, 9 * mm))
    story.append(Paragraph(
        "<para fontSize=12 fontName='Times-Roman'>Perihal{}: Permohonan Penghentian Studi Sementara</para>".format('&nbsp;' * 20), styles['Normal']))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(
        "<para fontSize=12 fontName='Times-Roman'>{}( Cuti Akademik )</para>".format('&nbsp;' * 33), styles['Normal']))
    story.append(Spacer(1, 9 * mm))
    story.append(Paragraph(
        "<para fontSize=12 fontName='Times'>Yth. Rektor</para>", styles['Normal']))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(
        "<para fontSize=12 fontName='Times'>Universitas Bale Bandung</para>", styles['Normal']))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(
        "<para fontSize=12 fontName='Times'>Baleendah.</para>", styles['Normal']))
    story.append(Spacer(1, 9 * mm))
    story.append(Paragraph(
        "<para fontSize=12 fontName='Times'>Yang bertanda tangan dibawah ini :</para>", styles['Normal']))
    story.append(Spacer(1, 9 * mm))

    story.append(Paragraph(
        "<para fontSize=12 fontName='Times-Roman'>Nama{}: {}</para>".format('&nbsp;' * 48, nama), styles['Normal']))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(
        "<para fontSize=12 fontName='Times-Roman'>NIM{}: {}</para>".format('&nbsp;' * 50, nim), styles['Normal']))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(
        "<para fontSize=12 fontName='Times-Roman'>Semester{}: {}</para>".format('&nbsp;' * 43, semester), styles['Normal']))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(
        "<para fontSize=12 fontName='Times-Roman'>SKS/IPK{}:</para>".format('&nbsp;' * 43), styles['Normal']))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(
        "<para fontSize=12 fontName='Times-Roman'>Program Studi{}: {}</para>".format('&nbsp;' * 35, jurusan), styles['Normal']))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(
        "<para fontSize=12 fontName='Times-Roman'>Sudah/ Belum pernah cuti{}:</para>".format('&nbsp;' * 16), styles['Normal']))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(
        "<para fontSize=12 fontName='Times-Roman'>Lama cuti yang lalu{}:</para>".format('&nbsp;' * 26), styles['Normal']))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(
        "<para fontSize=12 fontName='Times-Roman'>Alamat/ No telp/ HP{}:</para>".format('&nbsp;' * 25), styles['Normal']))
    story.append(Spacer(1, 9 * mm))

    story.append(Paragraph(
        "<para fontSize=12 fontName='Times-Roman'>Mengajukan permohonan penghentian studi sementara ( cuti akademik )</para>", styles['Normal']))
    story.append(Spacer(1, 9 * mm))

    story.append(Paragraph(
        "<para fontSize=12 fontName='Times-Roman'>Pada Semester/ Tahun Akademik{}:</para>".format('&nbsp;' * 5), styles['Normal']))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(
        "<para fontSize=12 fontName='Times-Roman'>Alasan Cuti Akademik{}:</para>".format('&nbsp;' * 22), styles['Normal']))
    story.append(Spacer(1, 9 * mm))

    story.append(Paragraph(
        "<para fontSize=12 fontName='Times-Roman'>Atas perhatian saudara kami ucapkan terimakasih</para>", styles['Normal']))
    story.append(Spacer(1, 9 * mm))

    tgl = 'Baleendah, {} Oktober 2018'.format(8)

    ttd_skelecton = [
        ['Mengetahui/ Menyetujui', '', "Baleendah, {}".format(tanggal_sekarang)],
        ['Dekan,', '', 'Hormat Saya,'],
        ['', '', ''],
        ['({})'.format(dekan), '', '({})'.format(nama)],
    ]

    ttd = Table(
        ttd_skelecton,
        colWidths=(
            60*mm, '100%', 60*mm
        ),
        rowHeights=(
            5*mm, 5*mm, 20*mm, 5*mm
        )
    )

    ttd_style = TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONT', (0, 0), (-1, -1), 'Times-Roman', 12)
    ])

    ttd.setStyle(ttd_style)

    story.append(ttd)

    story.append(Spacer(1, 10 * mm))
    story.append(Paragraph(
        "<para fontSize=12 fontName='Times-Roman'>Tembusan :</para>", styles['Normal']))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(
        "<para fontSize=12 fontName='Times-Roman'>{}1. Biro Akademik</para>".format('&nbsp;' * 10), styles['Normal']))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(
        "<para fontSize=12 fontName='Times-Roman'>{}2. Dosen Wali</para>".format('&nbsp;' * 10), styles['Normal']))

    doc.build(story)
