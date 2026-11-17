(function () {
  "use strict";

  var STORAGE_KEY = "maganghub.laporan.v1";
  var MIN_SYARAT = 100;
  var MIN_DRAF = 150;
  var FORBIDDEN = /tidak\s+masuk|bolos|lupa\s+absen/i;
  var PROFILE = {
    name: "Bintang Respati Aryananda, S.T.",
    program: "Teknik Metalurgi",
    org: "MagangHub BRIN"
  };

  var MOCK_SAMPLES = [
    {
      date: "2026-11-15",
      kegiatan: "Lab",
      poin: "Menyiapkan area kerja dan alat keselamatan\nMengamati preparasi sampel logam sesuai SOP\nBerdiskusi urutan kerja dengan mentor",
      uraian: "Pada hari ini saya melaksanakan kegiatan di laboratorium sebagai bagian dari magang riset metalurgi di BRIN. Tiga pokok yang saya kerjakan hari ini adalah menyiapkan area kerja dan alat keselamatan, mengamati preparasi sampel logam sesuai SOP, dan berdiskusi urutan kerja dengan mentor. Selama kegiatan saya mengikuti SOP yang berlaku, memakai perlengkapan keselamatan yang diperlukan, dan menjaga kebersihan meja kerja. Menjelang akhir sesi saya memeriksa kembali catatan, menyampaikan ringkasan pekerjaan kepada mentor, dan meninggalkan area kerja dalam keadaan tertib.",
      pelajaran: "Dari kegiatan laboratorium hari ini saya memahami bahwa ketelitian preparasi dan kedisiplinan mengikuti prosedur sangat memengaruhi mutu pengamatan pada riset metalurgi. Cara sampel ditangani menentukan apakah informasi yang nanti dibaca dari material masih dapat dipercaya. Catatan kegiatan yang paling saya kaitkan dengan pelajaran ini: menyiapkan area kerja dan alat keselamatan.",
      kendala: "Kendala yang saya alami adalah adaptasi terhadap urutan penggunaan peralatan yang masih relatif baru bagi saya. Pada awalnya saya ragu membedakan langkah persiapan dan langkah kerja inti. Saya mengatasinya dengan bertanya kepada mentor, mencatat urutannya, lalu mengulangi langkah tersebut secara lebih perlahan.",
      savedAt: "2026-11-15T14:30:00.000Z"
    },
    {
      date: "2026-11-16",
      kegiatan: "Studi Literatur",
      poin: "Membaca bab tentang korosi baja karbon\nMencatat istilah fasa dan struktur mikro\nBertanya kaitannya dengan kegiatan di lab",
      uraian: "Pada hari ini saya melakukan studi literatur untuk memperdalam konsep yang berkaitan dengan kegiatan riset metalurgi. Tiga pokok yang saya kerjakan hari ini adalah membaca bab tentang korosi baja karbon, mencatat istilah fasa dan struktur mikro, dan bertanya kaitannya dengan kegiatan di lab. Saya membaca secara bertahap, menandai istilah yang belum paham, lalu mendiskusikannya dengan mentor agar artinya tidak saya tebak. Di akhir sesi saya merangkum butir yang sudah saya pahami, menyimpan catatan istilah, dan mengonfirmasi ringkasan kepada mentor.",
      pelajaran: "Dari studi literatur hari ini saya memahami bahwa bacaan ilmiah membantu saya melihat alasan di balik prosedur pada riset metalurgi. Tanpa konteks itu, langkah di laboratorium mudah dihafal tetapi sulit dijelaskan. Catatan kegiatan yang paling saya kaitkan dengan pelajaran ini: membaca bab tentang korosi baja karbon.",
      kendala: "Kendala yang saya alami adalah beberapa bagian bacaan memakai istilah yang masih baru bagi saya. Saya tidak memaksakan tafsiran sendiri. Saya menandai istilah itu, bertanya kepada mentor, dan menuliskan penjelasannya dalam catatan.",
      savedAt: "2026-11-16T14:30:00.000Z"
    },
    {
      date: "2026-11-17",
      kegiatan: "Bimbingan Mentor",
      poin: "Menyampaikan perkembangan catatan magang\nMembahas cara membaca grafik hasil uji umum\nMenyusun rencana kegiatan minggu depan",
      uraian: "Pada hari ini saya mengikuti bimbingan mentor untuk memperdalam pemahaman kegiatan riset metalurgi di BRIN. Tiga pokok yang saya kerjakan hari ini adalah menyampaikan perkembangan catatan magang, membahas cara membaca grafik hasil uji umum, dan menyusun rencana kegiatan minggu depan. Mentor menjelaskan kaitan antara prosedur kerja dan konsep metalurgi yang mendasarinya, lalu saya mencatatnya secara berurutan. Di akhir bimbingan saya merangkum arahan, meminta konfirmasi, dan menetapkan catatan yang akan saya bawa ke kegiatan berikutnya.",
      pelajaran: "Dari bimbingan hari ini saya memahami bahwa riset metalurgi membutuhkan alur pikir yang tertib, mulai dari tujuan, prosedur, hingga cara membaca temuan secara hati-hati. Arahan mentor membantu saya melihat hubungan itu secara utuh. Catatan kegiatan yang paling saya kaitkan dengan pelajaran ini: menyampaikan perkembangan catatan magang.",
      kendala: "Kendala yang saya alami adalah beberapa konsep yang dibahas masih terasa abstrak bagi saya. Saya belum langsung mampu menghubungkannya dengan pekerjaan harian. Saya meminta mentor memberi contoh yang lebih dekat dengan kegiatan saya, lalu saya tulis ulang dengan bahasa sendiri.",
      savedAt: "2026-11-17T14:30:00.000Z"
    }
  ];

  function mergeMockSamples(current) {
    var byDate = {};
    (current || []).forEach(function (item) {
      byDate[item.date] = item;
    });
    MOCK_SAMPLES.forEach(function (item) {
      if (!byDate[item.date]) byDate[item.date] = item;
    });
    return Object.keys(byDate).sort().map(function (date) {
      return byDate[date];
    });
  }

  var KEGIATAN = {
    Lab: {
      fallback: [
        ["penyiapan area kerja sesuai prosedur", "pelaksanaan kegiatan laboratorium yang ditugaskan", "pencatatan langkah kerja serta konfirmasi kepada mentor"],
        ["pemeriksaan kelengkapan sebelum mulai", "pengerjaan tugas laboratorium secara berurutan", "diskusi singkat dengan mentor sebelum area kerja dirapikan"]
      ],
      buka: [
        "Pada hari ini saya melaksanakan kegiatan di laboratorium sebagai bagian dari magang riset metalurgi di BRIN.",
        "Hari ini saya bekerja di laboratorium dengan mengikuti arahan mentor sejak awal sesi.",
        "Kegiatan saya hari ini berlangsung di laboratorium, dimulai dari persiapan diri dan pemeriksaan area kerja.",
        "Saya membuka kegiatan laboratorium dengan meninjau instruksi yang diberikan mentor agar urutan kerja tidak tertukar."
      ],
      proses: [
        "Selama kegiatan saya mengikuti SOP yang berlaku, memakai perlengkapan keselamatan yang diperlukan, dan menjaga kebersihan meja kerja.",
        "Saya mencatat setiap tahap secara ringkas, lalu berdiskusi dengan mentor bila ada langkah yang belum saya pahami.",
        "Mentor meninjau cara saya bekerja, dan saya memperbaiki urutan yang masih ragu sebelum beralih ke tahap berikutnya.",
        "Saya tidak melewati prosedur penanganan sampel, serta merapikan alat pada tempatnya setelah selesai digunakan."
      ],
      tutup: [
        "Menjelang akhir sesi saya memeriksa kembali catatan, menyampaikan ringkasan pekerjaan kepada mentor, dan meninggalkan area kerja dalam keadaan tertib.",
        "Sebelum menutup kegiatan, saya mengonfirmasi pemahaman saya kepada mentor dan mencatat arahan yang perlu dibawa ke pekerjaan berikutnya.",
        "Saya mengakhiri kegiatan dengan meninjau ulang urutan kerja hari ini agar laporan sesuai dengan langkah yang benar-benar saya jalani.",
        "Setelah diskusi penutup dengan mentor, saya menyimpan catatan kerja dan memastikan peralatan kembali ke tempatnya."
      ],
      pelajaran: [
        "Dari kegiatan laboratorium hari ini saya memahami bahwa ketelitian preparasi dan kedisiplinan mengikuti prosedur sangat memengaruhi mutu pengamatan pada riset metalurgi. Cara sampel ditangani menentukan apakah informasi yang nanti dibaca dari material masih dapat dipercaya.",
        "Saya belajar bahwa keselamatan dan keteraturan kerja merupakan bagian dari metode, bukan pelengkap. Di laboratorium metalurgi, urutan penanganan material membantu menjaga kondisi sampel agar tetap dapat dibandingkan antar tahap.",
        "Pelajaran yang saya peroleh adalah pentingnya mencatat proses, bukan hanya mengingat hasil akhirnya. Catatan yang runtut membuat saya mampu menjelaskan pekerjaan kepada mentor dan menelusuri langkah yang masih perlu diperbaiki.",
        "Saya semakin paham bahwa diskusi dengan mentor menghubungkan keterampilan di laboratorium dengan konsep metalurgi, khususnya kaitan antara cara preparasi dan informasi yang dapat diperoleh dari suatu material."
      ],
      kendala: [
        "Kendala yang saya alami adalah adaptasi terhadap urutan penggunaan peralatan yang masih relatif baru bagi saya. Pada awalnya saya ragu membedakan langkah persiapan dan langkah kerja inti. Saya mengatasinya dengan bertanya kepada mentor, mencatat urutannya, lalu mengulangi langkah tersebut secara lebih perlahan.",
        "Saya masih perlu membiasakan diri dengan sejumlah istilah teknis di laboratorium. Karena artinya belum semuanya langsung saya pahami, pencatatan saya sempat tertinggal. Saya meminta mentor menjelaskan istilah itu dengan contoh sederhana, kemudian saya menuliskannya kembali dengan kalimat sendiri.",
        "Kendala yang wajar hari ini adalah menjaga catatan tetap rapi ketika kegiatan berjalan berurutan. Saya sempat menunda pencatatan sehingga detail urutan hampir terlewat. Saya mengubah cara kerja dengan mencatat tiap tahap sesaat setelah selesai, lalu meminta mentor memeriksa apakah urutannya sudah masuk akal.",
        "Saya membutuhkan waktu lebih lama untuk merasa yakin saat mengoperasikan alat yang belum sering saya gunakan. Agar tidak menerka, saya menghentikan langkah yang belum jelas dan bertanya kepada mentor. Arahan itu saya praktikkan kembali sampai pengerjaannya lebih tertib."
      ]
    },
    Observasi: {
      fallback: [
        ["pengamatan alur kerja sesuai arahan", "pencatatan hal yang terlihat secara berurutan", "klarifikasi catatan bersama mentor"],
        ["penyiapan lembar observasi", "pengamatan proses tanpa terburu-buru menyimpulkan", "perbaikan catatan setelah diskusi dengan mentor"]
      ],
      buka: [
        "Pada hari ini saya melakukan observasi kegiatan riset metalurgi sesuai arahan mentor di lingkungan MagangHub BRIN.",
        "Hari ini saya mengamati alur kerja yang sedang berlangsung dan mencatat hal-hal yang terlihat tanpa terburu-buru menyimpulkan.",
        "Kegiatan saya berfokus pada observasi, dimulai dari memahami tujuan pengamatan yang dijelaskan mentor.",
        "Saya memulai observasi dengan menyiapkan catatan dan memastikan saya mengetahui bagian proses yang perlu diperhatikan."
      ],
      proses: [
        "Saya mengamati urutan kerja secara bertahap, mencatat apa yang terlihat, lalu membandingkannya dengan penjelasan mentor.",
        "Selama observasi saya mengikuti SOP area tersebut, menjaga jarak aman, dan tidak mengganggu jalannya kegiatan.",
        "Mentor membantu saya membedakan fakta yang teramati dan tafsiran, sehingga catatan saya tetap berhati-hati.",
        "Saya menuliskan urutan pengamatan, menandai hal yang belum paham, dan menanyakannya pada jeda yang disepakati."
      ],
      tutup: [
        "Di akhir observasi saya merapikan catatan, menyampaikan ringkasan kepada mentor, dan memperbaiki kalimat yang masih membingungkan.",
        "Sebelum sesi ditutup, saya mengonfirmasi apakah urutan pengamatan yang saya tulis sudah sesuai dengan proses yang berlangsung.",
        "Saya menutup observasi dengan meninjau kembali poin penting dan menyimpan catatan sebagai bahan belajar.",
        "Setelah berdiskusi dengan mentor, saya menyusun ulang catatan agar alurnya mengikuti kegiatan dari awal sampai akhir."
      ],
      pelajaran: [
        "Dari observasi hari ini saya memahami bahwa mengamati proses sama pentingnya dengan membaca teori pada riset metalurgi. Urutan kerja yang terlihat membantu saya mengerti mengapa suatu prosedur tidak boleh dilewati.",
        "Saya belajar memisahkan apa yang benar-benar terlihat dari kesimpulan yang masih terlalu dini. Kebiasaan ini penting agar interpretasi material tidak dibangun dari dugaan.",
        "Pelajaran yang saya peroleh adalah cara membuat catatan observasi yang runtut. Catatan semacam itu berguna ketika saya perlu menghubungkan proses, struktur, dan perilaku material pada pembahasan berikutnya.",
        "Saya semakin paham bahwa observasi yang disiplin melatih ketelitian peneliti pemula. Dalam metalurgi, detail pada preparasi atau pengoperasian dapat mengubah makna data yang nanti dihasilkan."
      ],
      kendala: [
        "Kendala yang saya alami adalah belum terbiasa membedakan ciri yang terlihat mirip saat observasi. Saya sempat ragu memilih kata yang tepat untuk mencatatnya. Saya bertanya kepada mentor bagaimana menggambarkan temuan secara kualitatif, lalu memperbaiki catatan sesuai arahan tersebut.",
        "Saya masih lambat mengikuti istilah yang dipakai selama pengamatan. Agar tidak tertinggal, saya menandai istilah yang asing dan memintanya dijelaskan mentor setelah tahap yang sedang berjalan selesai.",
        "Kendala wajar yang saya temui adalah menjaga fokus catatan ketika banyak hal berlangsung berurutan. Saya sempat menulis terlalu umum. Mentor meminta saya mengurutkan kembali apa yang dilihat dari awal, dan cara itu membuat catatan saya lebih jelas.",
        "Saya perlu waktu untuk terbiasa berada di area observasi tanpa melewatkan langkah penting. Saya mengatasi rasa ragu dengan bertanya kepada mentor pada bagian yang belum jelas, kemudian mencatat jawabannya dengan kalimat sendiri."
      ]
    },
    "Bimbingan Mentor": {
      fallback: [
        ["penyampaian perkembangan pekerjaan kepada mentor", "diskusi mengenai bagian yang belum saya pahami", "pencatatan arahan menjadi urutan kerja"],
        ["penyiapan pertanyaan bimbingan", "pembahasan kaitan prosedur dan konsep metalurgi", "penyusunan ringkasan arahan mentor"]
      ],
      buka: [
        "Pada hari ini saya mengikuti bimbingan mentor untuk memperdalam pemahaman kegiatan riset metalurgi di BRIN.",
        "Hari ini saya berdiskusi dengan mentor mengenai rencana kerja dan hal-hal yang masih perlu saya pahami.",
        "Kegiatan saya berpusat pada sesi bimbingan, dimulai dari menyampaikan perkembangan pekerjaan yang sudah saya catat.",
        "Saya membuka bimbingan dengan menyiapkan pertanyaan, sehingga diskusi berjalan terarah dan tidak melewatkan hal penting."
      ],
      proses: [
        "Mentor menjelaskan kaitan antara prosedur kerja dan konsep metalurgi yang mendasarinya, lalu saya mencatatnya secara berurutan.",
        "Saya mengajukan bagian yang belum jelas, mendengarkan arahan, dan mengulang penjelasan tersebut dengan kalimat sendiri agar mentor dapat mengoreksinya.",
        "Kami meninjau urutan pekerjaan, termasuk SOP yang harus saya perhatikan dan cara menyusun catatan yang rapi.",
        "Saya mencatat arahan mentor menjadi butir-butir kerja, kemudian mengonfirmasi prioritas yang perlu dikerjakan lebih dulu."
      ],
      tutup: [
        "Di akhir bimbingan saya merangkum arahan, meminta konfirmasi, dan menetapkan catatan yang akan saya bawa ke kegiatan berikutnya.",
        "Sebelum sesi ditutup, saya memastikan setiap pertanyaan utama sudah terjawab atau sudah saya tandai untuk dipelajari lagi.",
        "Saya menutup bimbingan dengan menyusun ulang catatan diskusi agar urutannya mudah dibaca saat saya mengerjakan tugas.",
        "Setelah mentor meninjau ringkasan saya, saya memperbaiki bagian yang masih kurang tepat dan menyimpan catatan tersebut."
      ],
      pelajaran: [
        "Dari bimbingan hari ini saya memahami bahwa riset metalurgi membutuhkan alur pikir yang tertib, mulai dari tujuan, prosedur, hingga cara membaca temuan secara hati-hati. Arahan mentor membantu saya melihat hubungan itu secara utuh.",
        "Saya belajar bahwa bertanya dengan spesifik membuat bimbingan lebih berguna. Ketika saya mampu menunjukkan bagian yang belum paham, mentor dapat mengoreksi konsep sebelum saya menerapkannya pada pekerjaan.",
        "Pelajaran yang saya peroleh adalah pentingnya menghubungkan teori metalurgi dengan kebiasaan kerja di laboratorium atau saat mengolah catatan. Pemahaman konsep saja belum cukup bila urutan kerjanya belum saya kuasai.",
        "Saya semakin paham bahwa catatan bimbingan adalah bagian dari metode belajar riset. Dengan catatan yang rapi, saya dapat menelusuri alasan di balik suatu prosedur, bukan hanya menghafal langkahnya."
      ],
      kendala: [
        "Kendala yang saya alami adalah beberapa konsep yang dibahas masih terasa abstrak bagi saya. Saya belum langsung mampu menghubungkannya dengan pekerjaan harian. Saya meminta mentor memberi contoh yang lebih dekat dengan kegiatan saya, lalu saya tulis ulang dengan bahasa sendiri.",
        "Saya sempat kesulitan menyusun pertanyaan karena belum tahu istilah yang tepat. Mentor membantu saya meluruskan istilah tersebut, dan saya mencatat padanannya agar diskusi berikutnya lebih lancar.",
        "Kendala wajar hari ini adalah memilah arahan yang banyak menjadi urutan kerja yang sederhana. Saya khawatir melewatkan hal penting. Setelah bertanya kepada mentor, saya mengelompokkan arahan menjadi persiapan, pelaksanaan, dan hal yang perlu dikonfirmasi.",
        "Saya perlu waktu lebih lama untuk memahami penjelasan yang padat. Agar tidak berpura-pura paham, saya menghentikan bagian yang belum jelas dan memintanya diulang. Cara itu membuat catatan saya lebih dapat saya gunakan."
      ]
    },
    "Olah Data": {
      fallback: [
        ["pengumpulan catatan kegiatan", "pengelompokan informasi sesuai urutan kerja", "konfirmasi susunan catatan kepada mentor"],
        ["pemeriksaan kelengkapan catatan", "perapian data tanpa mengubah makna pengamatan", "peninjauan hasil susunan bersama mentor"]
      ],
      buka: [
        "Pada hari ini saya mengolah catatan kegiatan riset metalurgi agar lebih rapi dan mudah ditinjau kembali.",
        "Hari ini saya fokus pada olah data, dimulai dari mengumpulkan catatan yang sudah saya buat pada kegiatan sebelumnya.",
        "Kegiatan saya adalah merapikan data dan catatan kerja sesuai arahan mentor, tanpa mengubah makna pengamatan yang sudah tercatat.",
        "Saya memulai olah data dengan memeriksa kelengkapan catatan, lalu mengelompokkannya berdasarkan urutan pekerjaan."
      ],
      proses: [
        "Saya memeriksa apakah setiap catatan masih mengikuti urutan kerja, kemudian menandai bagian yang perlu dikonfirmasi kepada mentor.",
        "Selama mengolah data saya menjaga agar isian tetap dapat ditelusuri, termasuk dari mana catatan itu berasal dan pada tahap mana dicatat.",
        "Mentor meninjau cara saya mengelompokkan informasi, dan saya memperbaiki pengelompokan yang masih tercampur.",
        "Saya menyusun catatan menjadi alur yang lebih mudah dibaca, lalu berdiskusi dengan mentor mengenai bagian yang masih ambigu."
      ],
      tutup: [
        "Di akhir kegiatan saya meninjau ulang kerapian catatan, menyimpan berkas kerja, dan menyampaikan kemajuan kepada mentor.",
        "Sebelum selesai, saya memastikan tidak ada catatan yang saya pindahkan tanpa konteks, lalu meminta mentor melihat hasil susunannya.",
        "Saya menutup olah data dengan membuat ringkasan singkat mengenai apa yang sudah rapi dan apa yang masih perlu dilengkapi.",
        "Setelah konfirmasi mentor, saya merapikan berkas dan mencatat hal yang harus saya perhatikan pada pengolahan berikutnya."
      ],
      pelajaran: [
        "Dari olah data hari ini saya memahami bahwa kerapian catatan adalah bagian dari kejujuran ilmiah pada riset metalurgi. Data yang tercampur atau kehilangan urutan akan sulit ditafsirkan, walaupun pengerjaannya sudah dilakukan.",
        "Saya belajar bahwa mengolah data bukan sekadar merapikan tampilan, melainkan menjaga agar informasi tetap dapat ditelusuri. Kebiasaan ini penting sebelum suatu hasil dibahas atau dibandingkan.",
        "Pelajaran yang saya peroleh adalah kehati-hatian saat membaca catatan sendiri. Saya menjaga agar tidak memasukkan kesimpulan yang tidak tercatat pada kegiatan asalnya, karena hal itu dapat menyesatkan pembahasan metalurgi.",
        "Saya semakin paham bahwa diskusi dengan mentor saat mengolah data membantu saya membedakan fakta catatan dan tafsiran. Perbedaan itu penting agar analisis material tidak meloncat dari data yang belum lengkap."
      ],
      kendala: [
        "Kendala yang saya alami adalah format catatan lama yang belum seragam, sehingga saya perlu waktu untuk mengelompokkannya. Saya bertanya kepada mentor mengenai susunan yang paling sederhana, lalu memakai susunan itu secara konsisten.",
        "Saya sempat bingung membedakan catatan proses dan catatan yang masih berupa dugaan. Agar tidak tercampur, saya meminta mentor menunjukkan contoh pemisahannya, kemudian saya memperbaiki susunan kerja saya.",
        "Kendala wajar hari ini adalah menjaga ketelitian saat memindahkan catatan agar tidak ada butir yang tertinggal. Saya mengatasinya dengan mencentang setiap butir yang sudah dipindahkan dan meminta mentor meninjau bagian yang saya ragukan.",
        "Saya masih beradaptasi dengan cara menyusun data yang diminta pada kegiatan ini. Beberapa istilah pengelompokan belum saya kuasai. Saya mencatat istilah tersebut dan memintanya dijelaskan mentor sebelum melanjutkan."
      ]
    },
    "Studi Literatur": {
      fallback: [
        ["pembacaan bahan yang diarahkan mentor", "pencatatan istilah dan gagasan utama", "diskusi bagian yang belum saya pahami"],
        ["pemilihan bagian bacaan yang paling relevan", "penulisan ringkasan dengan kalimat sendiri", "konfirmasi istilah teknis kepada mentor"]
      ],
      buka: [
        "Pada hari ini saya melakukan studi literatur untuk memperdalam konsep yang berkaitan dengan kegiatan riset metalurgi.",
        "Hari ini saya membaca bahan bacaan yang diarahkan mentor dan mencatat gagasan utamanya dengan bahasa sendiri.",
        "Kegiatan saya berfokus pada studi literatur, dimulai dari menentukan bagian bacaan yang paling dekat dengan pekerjaan magang.",
        "Saya membuka studi literatur dengan menyiapkan catatan istilah, agar pembahasan yang padat tetap dapat saya ikuti."
      ],
      proses: [
        "Saya membaca secara bertahap, menandai istilah yang belum paham, lalu mendiskusikannya dengan mentor agar artinya tidak saya tebak.",
        "Selama membaca saya mencatat kaitan antara konsep di literatur dan prosedur kerja yang saya temui di kegiatan magang.",
        "Mentor membantu saya memilih bagian yang perlu diprioritaskan, sehingga saya tidak hanya menyalin kalimat yang panjang.",
        "Saya membandingkan penjelasan dari bahan yang saya baca dengan catatan kegiatan, kemudian menanyakan hal yang masih belum jelas."
      ],
      tutup: [
        "Di akhir sesi saya merangkum butir yang sudah saya pahami, menyimpan catatan istilah, dan mengonfirmasi ringkasan kepada mentor.",
        "Sebelum menutup studi literatur, saya menuliskan pertanyaan yang masih tersisa agar dapat ditanyakan pada bimbingan berikutnya.",
        "Saya mengakhiri kegiatan dengan menyusun ulang catatan bacaan sesuai urutan: konsep, kaitan dengan pekerjaan, lalu hal yang perlu diklarifikasi.",
        "Setelah mentor meninjau ringkasan saya, saya memperbaiki istilah yang masih kurang tepat dan menutup catatan hari ini."
      ],
      pelajaran: [
        "Dari studi literatur hari ini saya memahami bahwa bacaan ilmiah membantu saya melihat alasan di balik prosedur pada riset metalurgi. Tanpa konteks itu, langkah di laboratorium mudah dihafal tetapi sulit dijelaskan.",
        "Saya belajar bahwa mencatat dengan kalimat sendiri lebih berguna daripada menyalin utuh. Kebiasaan ini melatih saya memahami hubungan proses, struktur, dan sifat material secara lebih jernih.",
        "Pelajaran yang saya peroleh adalah kehati-hatian dalam memakai istilah teknis. Pada metalurgi, istilah yang mirip dapat menunjuk pada hal yang berbeda, sehingga saya perlu memastikan artinya bersama mentor.",
        "Saya semakin paham bahwa literatur menjadi jembatan antara teori dan kegiatan magang. Dengan membaca secara terarah, saya dapat menyiapkan pertanyaan yang lebih baik sebelum bekerja di laboratorium atau mengolah catatan."
      ],
      kendala: [
        "Kendala yang saya alami adalah beberapa bagian bacaan memakai istilah yang masih baru bagi saya. Saya tidak memaksakan tafsiran sendiri. Saya menandai istilah itu, bertanya kepada mentor, dan menuliskan penjelasannya dalam catatan.",
        "Saya sempat kewalahan karena paragraf yang padat. Mentor menyarankan saya memecah bacaan menjadi butir-butir singkat, dan cara itu membuat saya lebih mudah mengikuti alurnya.",
        "Kendala wajar hari ini adalah membedakan gagasan utama dari rincian yang belum perlu saya kuasai. Saya bertanya kepada mentor bagian mana yang paling relevan dengan kegiatan magang, lalu memfokuskan catatan pada bagian tersebut.",
        "Saya membutuhkan waktu lebih lama untuk menghubungkan isi bacaan dengan pekerjaan yang sudah saya lakukan. Setelah berdiskusi dengan mentor, saya membuat dua kolom sederhana: konsep yang saya baca dan kegiatan magang yang terkait."
      ]
    },
    Lainnya: {
      fallback: [
        ["pengerjaan tugas yang diberikan mentor", "pencatatan kemajuan secara berkala", "konfirmasi hasil kerja sebelum kegiatan ditutup"],
        ["pemahaman instruksi di awal sesi", "pelaksanaan pekerjaan sesuai urutan", "diskusi penutup bersama mentor"]
      ],
      buka: [
        "Pada hari ini saya menjalankan kegiatan magang yang ditugaskan mentor di lingkungan riset metalurgi BRIN.",
        "Hari ini saya mengerjakan tugas yang diberikan, dengan tetap mengikuti tata tertib dan arahan yang sudah dijelaskan.",
        "Kegiatan saya berlangsung sesuai penugasan hari ini, dimulai dari memastikan saya memahami hasil yang diharapkan.",
        "Saya memulai pekerjaan dengan berdiskusi singkat bersama mentor mengenai urutan kerja yang perlu diselesaikan."
      ],
      proses: [
        "Saya mengerjakan tugas secara berurutan, mencatat kemajuan, dan menanyakan bagian yang belum jelas sebelum melanjutkan.",
        "Selama kegiatan saya mengikuti SOP yang berlaku di area kerja serta menjaga kerapian catatan.",
        "Mentor meninjau perkembangan pekerjaan saya, lalu saya menyesuaikan cara kerja sesuai masukan tersebut.",
        "Saya memisahkan hal yang sudah selesai dan hal yang masih perlu dikonfirmasi, agar tidak ada langkah yang terlewat."
      ],
      tutup: [
        "Di akhir kegiatan saya merapikan area kerja, menyampaikan ringkasan kepada mentor, dan menyimpan catatan pekerjaan.",
        "Sebelum selesai, saya memeriksa kembali hasil pengerjaan secara umum dan meminta mentor mengonfirmasi bagian yang saya ragukan.",
        "Saya menutup kegiatan dengan meninjau urutan pekerjaan hari ini agar laporannya sesuai dengan yang saya lakukan.",
        "Setelah diskusi penutup, saya mencatat arahan untuk tindak lanjut dan memastikan pekerjaan hari ini terdokumentasi dengan rapi."
      ],
      pelajaran: [
        "Dari kegiatan hari ini saya memahami bahwa kedisiplinan mengikuti arahan dan mencatat proses tetap penting pada riset metalurgi, apa pun bentuk tugasnya. Kebiasaan itu menjaga pekerjaan saya dapat dipertanggungjawabkan.",
        "Saya belajar bahwa komunikasi dengan mentor mengurangi kesalahan yang muncul karena asumsi. Pada pekerjaan material, asumsi yang tidak dikonfirmasi dapat membuat langkah berikutnya keliru.",
        "Pelajaran yang saya peroleh adalah pentingnya menyelesaikan pekerjaan secara urut dan rapi. Keterampilan ini mendukung kegiatan laboratorium, observasi, maupun pengolahan catatan pada magang saya.",
        "Saya semakin paham bahwa setiap tugas magang, termasuk yang bersifat penunjang, melatih ketelitian yang dibutuhkan peneliti pemula di bidang metalurgi."
      ],
      kendala: [
        "Kendala yang saya alami adalah menyesuaikan diri dengan urutan tugas yang belum sepenuhnya saya hafal. Saya bertanya kepada mentor sebelum mengerjakan bagian yang masih ragu, lalu mencatat urutannya.",
        "Saya masih beradaptasi dengan istilah yang dipakai pada tugas hari ini. Agar tidak salah memahami, saya meminta mentor mengulang artinya dan saya tuliskan dengan kalimat sendiri.",
        "Kendala wajar yang saya temui adalah membagi waktu antara mengerjakan dan mencatat. Saya sempat fokus pada pengerjaan sehingga catatan tertinggal. Setelah diingatkan mentor, saya mencatat kemajuan secara berkala.",
        "Saya membutuhkan konfirmasi lebih sering karena beberapa instruksi masih baru bagi saya. Saya memilih bertanya kepada mentor daripada menerka, dan pekerjaan selanjutnya menjadi lebih tertib."
      ]
    }
  };

  function take(list, seed, salt) {
    return list[Math.abs(seed * salt + salt) % list.length];
  }

  function joinAnd(items) {
    if (items.length <= 1) return items[0] || "";
    if (items.length === 2) return items[0] + " dan " + items[1];
    return items.slice(0, -1).join(", ") + ", dan " + items[items.length - 1];
  }

  function cleanPoint(line) {
    return String(line || "")
      .replace(/^\s*(?:[-*•]+|\d+[.)]|[a-zA-Z][.)])\s*/, "")
      .replace(/[.\s]+$/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function soften(point) {
    var text = String(point || "").trim().replace(/^saya\s+/i, "");
    var firstWord = text.split(/\s+/)[0] || "";
    var acronym = firstWord.length > 1 && firstWord.length <= 5 && firstWord === firstWord.toUpperCase() && /[A-Z]/.test(firstWord);
    if (!acronym && /^[A-ZÀ-Ý][a-zà-ý]/.test(text)) {
      text = text.charAt(0).toLowerCase() + text.slice(1);
    }
    return text.trim();
  }

  function parsePoin(raw) {
    var text = String(raw || "").replace(/\r/g, "").trim();
    if (!text) return { items: [], dropped: 0 };
    var parts = text.split(/\n+/);
    if (parts.length === 1) {
      var numbered = text.split(/\s*(?=\d+[.)]\s+)/).map(function (part) {
        return part.trim();
      }).filter(Boolean);
      if (numbered.length > 1) parts = numbered;
    }
    var items = [];
    var dropped = 0;
    parts.forEach(function (part) {
      var clean = cleanPoint(part);
      if (!clean) return;
      if (FORBIDDEN.test(clean)) {
        dropped += 1;
        return;
      }
      items.push(clean.slice(0, 180));
    });
    return { items: items.slice(0, 6), dropped: dropped };
  }

  function kalimatPoin(items, fallbackSets, seed) {
    var soft = items.map(soften).filter(Boolean);
    if (soft.length >= 3) {
      var three = soft.slice(0, 3);
      var more = soft.slice(3);
      var base = take([
        "Tiga pokok yang saya kerjakan hari ini adalah " + joinAnd(three) + ".",
        "Urutan pekerjaan saya meliputi " + three[0] + ", dilanjutkan dengan " + three[1] + ", lalu " + three[2] + ".",
        "Secara berurutan saya melakukan kegiatan berikut: " + three[0] + ", " + three[1] + ", dan " + three[2] + ".",
        "Fokus kegiatan yang saya catat mencakup " + joinAnd(three) + "."
      ], seed, 11);
      if (!more.length) return base;
      return base + " Selain itu saya mencatat kegiatan lain, yaitu " + joinAnd(more) + ".";
    }
    if (soft.length === 2) {
      return take([
        "Dua hal yang saya kerjakan hari ini adalah " + soft[0] + " dan " + soft[1] + ".",
        "Saya memulai dengan " + soft[0] + ", kemudian " + soft[1] + ".",
        "Pekerjaan yang saya catat hari ini ialah " + soft[0] + " serta " + soft[1] + ".",
        "Kegiatan saya terbagi menjadi " + soft[0] + " dan " + soft[1] + "."
      ], seed, 11);
    }
    if (soft.length === 1) {
      return take([
        "Kegiatan yang saya catat hari ini berfokus pada " + soft[0] + ".",
        "Pekerjaan utama yang saya jalankan adalah " + soft[0] + ".",
        "Inti kegiatan saya pada hari ini ialah " + soft[0] + ".",
        "Hal yang saya kerjakan dan catat hari ini adalah " + soft[0] + "."
      ], seed, 11);
    }
    var set = take(fallbackSets, seed, 17);
    return take([
      "Tiga pokok yang saya kerjakan hari ini adalah " + joinAnd(set) + ".",
      "Urutan pekerjaan saya meliputi " + set[0] + ", dilanjutkan dengan " + set[1] + ", lalu " + set[2] + ".",
      "Secara berurutan saya melakukan kegiatan berikut: " + set[0] + ", " + set[1] + ", dan " + set[2] + ".",
      "Fokus kegiatan yang saya catat mencakup " + joinAnd(set) + "."
    ], seed, 11);
  }

  function ensureLength(text, fillers, seed) {
    var out = String(text || "").replace(/\s+/g, " ").trim();
    var pool = (fillers || []).filter(function (item) {
      return item && out.indexOf(item) === -1;
    });
    var i = 0;
    while (out.length < MIN_DRAF && i < pool.length) {
      out += " " + pool[(seed + i) % pool.length];
      i += 1;
    }
    var extra = "Saya mencatat arahan mentor dan akan menerapkannya pada kegiatan berikutnya agar pekerjaan saya lebih tertib.";
    var guard = 0;
    while (out.length < MIN_DRAF && guard < 4) {
      out += " " + extra;
      guard += 1;
    }
    return out.trim();
  }

  function guardText(text) {
    if (!FORBIDDEN.test(text)) return text;
    return ensureLength(
      "Saya menjalankan kegiatan magang sesuai arahan mentor, mengikuti prosedur yang dijelaskan, dan mencatat urutan pekerjaan dari awal hingga akhir. Bagian yang belum saya pahami saya tanyakan langsung kepada mentor, lalu saya perbaiki catatan berdasarkan arahan tersebut.",
      [],
      0
    );
  }

  function composeReport(input) {
    var source = input || {};
    var kegiatanName = KEGIATAN[source.kegiatan] ? source.kegiatan : "Lainnya";
    var bank = KEGIATAN[kegiatanName];
    var parsed = Array.isArray(source.poin) ? { items: source.poin, dropped: 0 } : parsePoin(source.poin);
    var items = parsed.items.filter(function (item) {
      return item && !FORBIDDEN.test(item);
    });
    var seed = Number.isInteger(source.seed) ? Math.abs(source.seed) : Math.floor(Math.random() * 9973);
    var kaitan = items.length
      ? " Catatan kegiatan yang paling saya kaitkan dengan pelajaran ini: " + soften(items[0]) + "."
      : "";
    return {
      kegiatan: kegiatanName,
      umum: items.length === 0,
      uraian: guardText(ensureLength(
        [take(bank.buka, seed, 3), kalimatPoin(items, bank.fallback, seed), take(bank.proses, seed, 5), take(bank.tutup, seed, 7)].join(" "),
        bank.tutup,
        seed
      )),
      pelajaran: guardText(ensureLength(take(bank.pelajaran, seed, 11) + kaitan, bank.pelajaran, seed + 1)),
      kendala: guardText(ensureLength(take(bank.kendala, seed, 13), bank.kendala, seed + 2))
    };
  }

  function statusLabel(length) {
    var count = Number(length) || 0;
    if (count < MIN_SYARAT) {
      return {
        ok: false,
        text: count + " / 100 karakter - Belum memenuhi syarat minimal 100 karakter"
      };
    }
    return {
      ok: true,
      text: count + " / 100 karakter - Sudah Memenuhi Syarat"
    };
  }

  function jakartaHour(date) {
    return new Date(date.getTime() + 7 * 60 * 60 * 1000).getUTCHours();
  }

  function shouldShowReminder(date) {
    return jakartaHour(date || new Date()) >= 20;
  }

  function todayISO(date) {
    var shifted = new Date((date || new Date()).getTime() + 7 * 60 * 60 * 1000);
    var month = String(shifted.getUTCMonth() + 1);
    var day = String(shifted.getUTCDate());
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return shifted.getUTCFullYear() + "-" + month + "-" + day;
  }

  function formatLongDate(date) {
    return new Intl.DateTimeFormat("id-ID", {
      timeZone: "Asia/Jakarta",
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date || new Date());
  }

  function formatISODate(iso) {
    var parts = String(iso || "").split("-");
    var year = Number(parts[0]);
    var month = Number(parts[1]);
    var day = Number(parts[2]);
    if (!year || !month || !day) return String(iso || "");
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC"
    }).format(new Date(Date.UTC(year, month - 1, day, 12)));
  }

  function textCopyAll(uraian, pelajaran, kendala) {
    return [
      "URAIAN AKTIVITAS",
      String(uraian || "").trim(),
      "",
      "PELAJARAN YANG DIPEROLEH",
      String(pelajaran || "").trim(),
      "",
      "KENDALA YANG DIALAMI",
      String(kendala || "").trim()
    ].join("\n");
  }

  function buildExportText(items) {
    var lines = [
      "LAPORAN HARIAN MAGANGHUB",
      "Nama: " + PROFILE.name,
      "Program: " + PROFILE.program,
      "Instansi: " + PROFILE.org,
      "",
      "Draf ini disusun untuk disalin manual ke monev.maganghub.kemnaker.go.id.",
      "Aplikasi tidak mengirim data ke mana pun.",
      ""
    ];
    items.slice().sort(function (a, b) {
      return String(a.date).localeCompare(String(b.date));
    }).forEach(function (item) {
      lines.push("------------------------------------------------------------");
      lines.push("Tanggal: " + formatISODate(item.date));
      lines.push("Kegiatan: " + item.kegiatan);
      if (item.poin) {
        lines.push("Poin singkat:");
        String(item.poin).split("\n").forEach(function (line) {
          if (line.trim()) lines.push("- " + line.trim());
        });
      }
      lines.push("");
      lines.push("URAIAN AKTIVITAS");
      lines.push(String(item.uraian || "").trim());
      lines.push("");
      lines.push("PELAJARAN YANG DIPEROLEH");
      lines.push(String(item.pelajaran || "").trim());
      lines.push("");
      lines.push("KENDALA YANG DIALAMI");
      lines.push(String(item.kendala || "").trim());
      lines.push("");
    });
    return lines.join("\n");
  }

  function init() {
    var tanggalHariIni = document.getElementById("tanggal-hari-ini");
    var banner = document.getElementById("banner-ingat");
    var form = document.getElementById("form-laporan");
    var inputTanggal = document.getElementById("input-tanggal");
    var inputPoin = document.getElementById("input-poin");
    var inputKegiatan = document.getElementById("input-kegiatan");
    var hasil = document.getElementById("hasil");
    var peringatan = document.getElementById("peringatan-poin");
    var fields = [
      { box: document.getElementById("out-uraian"), counter: document.getElementById("count-uraian"), copy: document.getElementById("btn-copy-uraian") },
      { box: document.getElementById("out-pelajaran"), counter: document.getElementById("count-pelajaran"), copy: document.getElementById("btn-copy-pelajaran") },
      { box: document.getElementById("out-kendala"), counter: document.getElementById("count-kendala"), copy: document.getElementById("btn-copy-kendala") }
    ];
    var viewLaporan = document.getElementById("view-laporan");
    var viewRiwayat = document.getElementById("view-riwayat");
    var navLaporan = document.getElementById("nav-laporan");
    var navRiwayat = document.getElementById("nav-riwayat");
    var badge = document.getElementById("badge-riwayat");
    var daftar = document.getElementById("daftar-riwayat");
    var kosong = document.getElementById("riwayat-kosong");
    var btnMuatContoh = document.getElementById("btn-muat-contoh");
    var toastEl = document.getElementById("toast");
    var toastTimer = 0;
    var previousSeed = -1;

    function toast(message) {
      toastEl.textContent = message;
      toastEl.classList.add("show");
      window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(function () {
        toastEl.classList.remove("show");
      }, 2200);
    }

    function loadAll() {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        var data = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(data)) return [];
        return data.filter(function (item) {
          return item && item.date && item.uraian && item.pelajaran && item.kendala;
        });
      } catch (err) {
        return [];
      }
    }

    function persist(items) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }

    function loadMockSamples(silent) {
      var next = mergeMockSamples(loadAll());
      if (next.length === loadAll().length && loadAll().length >= MOCK_SAMPLES.length) {
        if (!silent) toast("Contoh untuk tanggal ini sudah ada di riwayat.");
        return false;
      }
      try {
        persist(next);
      } catch (err) {
        toast("Gagal memuat contoh. Ruang penyimpanan browser penuh.");
        return false;
      }
      updateBadge();
      if (!viewRiwayat.hidden) renderHistory();
      if (!silent) toast("Contoh riwayat (3 hari) dimuat.");
      return true;
    }

    function refreshCounters() {
      fields.forEach(function (field) {
        var status = statusLabel(field.box.value.length);
        field.counter.textContent = status.text;
        field.counter.classList.toggle("ok", status.ok);
        field.counter.classList.toggle("bad", !status.ok);
      });
    }

    function refreshClock() {
      var now = new Date();
      tanggalHariIni.textContent = formatLongDate(now);
      banner.hidden = !shouldShowReminder(now);
    }

    function updateBadge() {
      badge.textContent = String(loadAll().length);
    }

    function showView(name) {
      var riwayat = name === "riwayat";
      viewLaporan.hidden = riwayat;
      viewRiwayat.hidden = !riwayat;
      if (riwayat) navLaporan.removeAttribute("aria-current");
      else navLaporan.setAttribute("aria-current", "page");
      if (riwayat) navRiwayat.setAttribute("aria-current", "page");
      else navRiwayat.removeAttribute("aria-current");
      if (riwayat) {
        renderHistory();
        viewRiwayat.querySelector("h2").focus();
      }
    }

    function renderHistory() {
      var items = loadAll().sort(function (a, b) {
        return String(b.date).localeCompare(String(a.date));
      });
      daftar.replaceChildren();
      kosong.hidden = items.length > 0;
      if (btnMuatContoh) btnMuatContoh.hidden = items.length > 0;
      items.forEach(function (item) {
        var card = document.createElement("article");
        card.className = "card history-card";
        var title = document.createElement("h3");
        title.textContent = formatISODate(item.date);
        var meta = document.createElement("p");
        meta.className = "meta";
        meta.textContent = item.kegiatan;
        var preview = document.createElement("p");
        preview.className = "preview";
        preview.textContent = item.uraian;
        var row = document.createElement("div");
        row.className = "row";
        var openBtn = document.createElement("button");
        openBtn.type = "button";
        openBtn.className = "btn btn-small btn-primary";
        openBtn.textContent = "Buka";
        openBtn.addEventListener("click", function () { openReport(item.date); });
        var deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "btn btn-small btn-danger";
        deleteBtn.textContent = "Hapus";
        deleteBtn.addEventListener("click", function () { deleteReport(item.date); });
        row.append(openBtn, deleteBtn);
        card.append(title, meta, preview, row);
        daftar.appendChild(card);
      });
      updateBadge();
    }

    function openReport(date) {
      var item = loadAll().find(function (entry) { return entry.date === date; });
      if (!item) return;
      inputTanggal.value = item.date;
      inputKegiatan.value = KEGIATAN[item.kegiatan] ? item.kegiatan : "Lainnya";
      inputPoin.value = item.poin || "";
      fields[0].box.value = item.uraian;
      fields[1].box.value = item.pelajaran;
      fields[2].box.value = item.kendala;
      peringatan.hidden = true;
      hasil.hidden = false;
      refreshCounters();
      showView("laporan");
      hasil.scrollIntoView({ behavior: motion(), block: "start" });
    }

    function deleteReport(date) {
      if (!window.confirm("Hapus laporan " + formatISODate(date) + "?")) return;
      persist(loadAll().filter(function (item) { return item.date !== date; }));
      renderHistory();
      toast("Laporan dihapus.");
    }

    function motion() {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    }

    function randomSeed() {
      var seed = Math.floor(Math.random() * 9973);
      if (seed === previousSeed) seed = (seed + 1) % 9973;
      previousSeed = seed;
      return seed;
    }

    async function copyText(text) {
      if (!String(text || "").trim()) {
        toast("Tidak ada teks untuk disalin.");
        return;
      }
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
          toast("Tersalin.");
          return;
        }
      } catch (err) {
        /* lanjut ke cara cadangan */
      }
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      var ok = document.execCommand("copy");
      area.remove();
      toast(ok ? "Tersalin." : "Gagal menyalin. Pilih teks lalu salin manual.");
    }

    function exportAll() {
      var items = loadAll();
      if (!items.length) {
        toast("Belum ada laporan tersimpan. Simpan dulu, lalu unduh.");
        return;
      }
      var blob = new Blob(["\uFEFF" + buildExportText(items)], { type: "text/plain;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.href = url;
      link.download = "laporan-maganghub-" + todayISO(new Date()) + ".txt";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast("File laporan diunduh.");
    }

    function generate(event) {
      if (event) event.preventDefault();
      if (!inputTanggal.value) {
        toast("Isi tanggal laporan.");
        return;
      }
      var parsed = parsePoin(inputPoin.value);
      var seed = randomSeed();
      var draft = composeReport({ kegiatan: inputKegiatan.value, poin: parsed.items, seed: seed });
      if (draft.uraian === fields[0].box.value && draft.pelajaran === fields[1].box.value) {
        seed = (seed + 1) % 9973;
        previousSeed = seed;
        draft = composeReport({ kegiatan: inputKegiatan.value, poin: parsed.items, seed: seed });
      }
      fields[0].box.value = draft.uraian;
      fields[1].box.value = draft.pelajaran;
      fields[2].box.value = draft.kendala;
      refreshCounters();
      var notes = [];
      if (parsed.dropped) {
        notes.push("Ada poin yang tidak dipakai karena berisi keterangan ketidakhadiran. Draf hanya disusun dari kegiatan yang dikerjakan.");
      }
      if (!parsed.items.length) {
        notes.push("Poin kegiatan masih kosong. Draf memakai uraian umum sesuai jenis kegiatan. Isi tiga poin agar laporannya lebih sesuai dengan hari ini.");
      }
      peringatan.textContent = notes.join(" ");
      peringatan.hidden = notes.length === 0;
      hasil.hidden = false;
      hasil.scrollIntoView({ behavior: motion(), block: "start" });
    }

    function saveReport() {
      if (!inputTanggal.value) {
        toast("Isi tanggal laporan.");
        return;
      }
      var uraian = fields[0].box.value.trim();
      var pelajaran = fields[1].box.value.trim();
      var kendala = fields[2].box.value.trim();
      if (!uraian || !pelajaran || !kendala) {
        toast("Susun ketiga draf terlebih dahulu.");
        return;
      }
      if (FORBIDDEN.test([uraian, pelajaran, kendala].join(" "))) {
        toast("Draf berisi keterangan ketidakhadiran. Ubah kalimat itu sebelum menyimpan.");
        return;
      }
      var parsed = parsePoin(inputPoin.value);
      var items = loadAll().filter(function (item) { return item.date !== inputTanggal.value; });
      var replaced = items.length !== loadAll().length;
      items.push({
        date: inputTanggal.value,
        kegiatan: inputKegiatan.value,
        poin: parsed.items.join("\n"),
        uraian: uraian,
        pelajaran: pelajaran,
        kendala: kendala,
        savedAt: new Date().toISOString()
      });
      try {
        persist(items);
      } catch (err) {
        toast("Gagal menyimpan. Ruang penyimpanan browser penuh.");
        return;
      }
      updateBadge();
      var label = formatISODate(inputTanggal.value);
      var short = [uraian, pelajaran, kendala].some(function (text) { return text.length < MIN_SYARAT; });
      if (short) {
        toast((replaced ? "Diperbarui" : "Tersimpan") + ", tetapi ada bagian di bawah 100 karakter.");
      } else {
        toast("Laporan " + label + (replaced ? " diperbarui." : " disimpan."));
      }
    }

    fields.forEach(function (field) {
      field.box.addEventListener("input", refreshCounters);
      field.copy.addEventListener("click", function () { copyText(field.box.value.trim()); });
    });

    form.addEventListener("submit", generate);
    inputPoin.addEventListener("keydown", function (event) {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        generate();
      }
    });
    document.getElementById("btn-copy-semua").addEventListener("click", function () {
      copyText(textCopyAll(fields[0].box.value, fields[1].box.value, fields[2].box.value));
    });
    document.getElementById("btn-simpan").addEventListener("click", saveReport);
    document.getElementById("btn-export").addEventListener("click", exportAll);
    document.getElementById("btn-export-riwayat").addEventListener("click", exportAll);
    navLaporan.addEventListener("click", function () { showView("laporan"); });
    navRiwayat.addEventListener("click", function () { showView("riwayat"); });
    if (btnMuatContoh) btnMuatContoh.addEventListener("click", function () { loadMockSamples(false); });

    inputTanggal.value = todayISO(new Date());
    refreshCounters();
    refreshClock();
    if (loadAll().length === 0) loadMockSamples(true);
    else updateBadge();
    window.setInterval(refreshClock, 60000);
  }

  var api = {
    init: init,
    parsePoin: parsePoin,
    composeReport: composeReport,
    statusLabel: statusLabel,
    shouldShowReminder: shouldShowReminder,
    jakartaHour: jakartaHour,
    todayISO: todayISO,
    buildExportText: buildExportText,
    textCopyAll: textCopyAll,
    mergeMockSamples: mergeMockSamples,
    MOCK_SAMPLES: MOCK_SAMPLES
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof document !== "undefined") document.addEventListener("DOMContentLoaded", init);
})();
