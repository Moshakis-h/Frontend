export const getSections = async (product) => {
  if (!product) return [];

  const extractPersonCount = (title) => {
    if (!title) return 0;
    const match = title.match(/(\d+)\s*شخص/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const personCount = extractPersonCount(product.title);
  
  // تحديد الحدود بناءً على عدد الأشخاص
  const getLimits = () => {
    // القيم الافتراضية للحدود
    let mainDishes = { min: 8, max: 8 };
    let salads = { min: 6, max: 6 };
    let sweet = { min: 4, max: 4 };

    if (personCount >= 20 && personCount < 75) {
      mainDishes = { min: 8, max: 8 };
      salads = { min: 6, max: 6 };
      sweet = { min: 4, max: 4 };
    } else if (personCount >= 75 && personCount < 100) {
      mainDishes = { min: 10, max: 10 };
      salads = { min: 6, max: 6 };
      sweet = { min: 6, max: 6 };
    } else if (personCount >= 100) {
      mainDishes = { min: 10, max: 10 };
      salads = { min: 6, max: 6 };
      sweet = { min: 6, max: 6 };
    }

    return { mainDishes, salads, sweet };
  };

  const limits = getLimits();

  let additionPrices = {};
  try {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/public/addition-prices`);
    if (response.ok) {
      const data = await response.json();
      if (data) {
        data.forEach(section => {
          additionPrices[section.sectionId] = section.items;
        });
      }
    } else {
      console.error("فشل في جلب أسعار الإضافات: ", response.status);
    }
  } catch (error) {
    console.error("فشل في جلب أسعار الإضافات", error);
  }
  // القسم المشترك لجميع المنتجات: تحديد تاريخ الطلب
  const dateSection = {
    id: 'deliveryDate',
    title: 'تحديد تاريخ الطلب:',
    required: true,
    min: 1,
    max: 1,
    options: [
      { 
        name: 'اختر تاريخ الطلب', 
        price: 0,
        isDatePicker: true
      }
    ]
  };

  // الأقسام الخاصة بكل فئة
  let categorySections = [];

  if (product?.category === "عروض المناسبات") {
    categorySections = [
      // الأقسام الثابتة (بدون تغيير)
      {
        id: 'buffetTime',
        title: 'فترة (فرش اغراض) البوفيه:',
        required: true,
        min: 1,
        max: 1,
        options: [
          { name: 'أغراض الغداء (من 9 صباحاً لغاية 12 ظهراً)', price: 0 },
          { name: 'أغراض العشاء (من 9 صباحاً لغاية 4 عصراً)', price: 0 }
        ]
      },
      {
        id: 'deliveryTime',
        title: 'فترة (توصيل أكل) البوفيه:',
        required: true,
        min: 1,
        max: 1,
        options: [
          { name: 'أكل الغداء (من 10 ظهراً لغاية 12 ظهراً)', price: 0 },
          { name: 'أكل غداء متأخر (من 12 ظهراً لغاية 2 ظهراً)', price: 0 },
          { name: 'أكل عشاء (من 5 مساءً لغاية 8 مساءً)', price: 0 }
        ]
      },
      {
        id: 'pickupTime',
        title: 'فترة (استلام أغراض) البوفيه:',
        required: true,
        min: 1,
        max: 1,
        options: [
          { name: 'استلام بعد انتهاء اليومية مباشرة', price: 0 },
          { name: 'استلام ثاني يوم (من 8 صباحاً لغاية 11 صباحاً)', prce: 0 }
        ]
      },
      {
        id: 'heaterTypes',
        title: 'شكل السخان:',
        required: false,
        min: 0,
        max: 1,
        options: [
          { name: 'ڤولدن (6 لتر)', price: 0 },
          { name: 'صدفي ابيض (6 لتر)', price: 0 },
          { name: 'خشبي(6 لتر)', price: 0 },
          { name: 'فراشة (6 لتر)', price: 0 },
          { name: 'سيلفر مستطيل (6 لتر)', price: 0 },
          { name: 'هندج ذهبي (6 لتر)', price: 0 },
          { name: 'هندج سيلفر (6 لتر)', price: 0 },
          { name: 'النخلة (5 لتر)', price: 0 },
          { name: 'كناري (6 لتر)', price: 0 },          
          { name: 'مظلع سيلفر (6 لتر)', price: 0 },
          { name: 'مظلع ذهبي (6 لتر)', price: 0 },
          { name: 'قاعدة سيلفر (6 لتر)', price: 0 },
          { name: 'قاعدة ذهبي (6 لتر)', price: 0 },
          { name: 'مدور سيلفر (6 لتر)', price: 0 },
          { name: 'مدور ذهبي (6 لتر)', price: 0 },
          { name: 'مربع سيلفر (6 لتر)', price: 0 },
          { name: 'مربع ذهبي (5 لتر)', price: 0 },
          { name: 'ثريا ذهبي (5 لتر)', price: 0 },
          { name: 'ثريا سيلفر (5 لتر)', price: 0 },         
        ]
      },
      {
        id: 'mainDishes',
        title: 'اختيارك من الأطباق الرئيسية:',
        required: false,
        min: limits.mainDishes.min,
        max: limits.mainDishes.max,
        options: [
          { name: 'سخان على اختيار الشيف العمومي', price: 0 },
          { name: 'عيش شيئت بالدجاج والكريمة (الأكثر مبيعاً)', price: 0 },
          { name: 'كباب بكريمة المشروم وشيت (الأكثر مبيعاً)', price: 0 },
          { name: 'كرات البطاط (الأكثر مبيعاً)', price: 0 },
          { name: 'معكرونة رافيولي (الأكثر مبيعاً)', price: 0 },
          { name: 'محاشي (الأكثر مبيعاً)', price: 0 },
          { name: 'دجاج سوبت اند ساور (الأكثر مبيعاً)', price: 0 },
          { name: 'عيش شمندر باللحم والكريمة (الأكثر مبيعاً)', price: 0 },
          { name: 'برياني دجاج (الأكثر مبيعاً)', price: 0 },
          { name: 'بينك باستا', price: 0 },
          { name: 'باستا بيتزا', price: 0 },
          { name: 'لازانيا', price: 0 },
          { name: 'معكرونة بشاميل', price: 0 },
          { name: 'فوتشيني', price: 0 },
          { name: 'سباغيتي تشاينسز', price: 0 },
          { name: 'عيش الزعفران مع بترتشيكن', price: 0 },
          { name: 'برياني لحم', price: 0 },
          { name: 'مكبوس دجاج', price: 0 },
          { name: 'مكبوس لحم', price: 0 },
          { name: 'ربع خروف', price: 0 },
          { name: 'مربين', price: 0 },
          { name: 'مرقة لحم مع البامية', price: 0 },
          { name: 'جريش', price: 0 },
          { name: 'هريس', price: 0 },
          { name: 'مرقوق', price: 0 },
          { name: 'كبة باللبن', price: 0 },
          { name: 'روبيان بالزعفران والكريمة', price: 0 },
          { name: 'ستيك لحم مع صوص المشروم', price:0 },
          { name: 'مشاوي مشكلة', price: 0 },
          { name: 'دجاج تندوري', price: 0 },
          { name: 'فاهيتا دجاج', price: 0 },
          { name: 'مسخن دجاج', price: 0 },
          { name: 'مكس كبب', price: 0 },
          { name: 'سبرنق رول', price: 0 },
          { name: 'شيش برك', price: 0 },
          { name: 'باستا بالترتشيكن *NEW*', price: 0 },
          { name: 'باستا الدجاج بالمشروم *NEW*', price: 0 },
          { name: 'سباغيتي بولونيز *NEW*', price: 0 },
          { name: 'باستا شورت ريبيز مشوي *NEW*', price: 0 },
          { name: 'بينك روزيتو ريبز *NEW*', price: 0 },
          { name: 'روزيتو بترتشيكن *NEW*', price: 0 },
          { name: 'تشكن روزيتو بالزعفران *NEW*', price: 0 },
          { name: 'باستا الدجاج بالباذنجان *NEW*', price: 0 },
          { name: 'كرات الفطر بالجبن *NEW*', price: 0 },
          { name: 'ميني سلايدر لحم *NEW*', price: 0 }
        ]
      },
      {
        id: 'salads',
        title: 'إختيارك من السلطات و المقبلات',
        required: true,
        min: limits.salads.min,
        max: limits.salads.max,
        options: [
          { name: 'سلطة على اختيار الشيف العمومي', price: 0 },
          { name: 'سلطة ناتشوز (الأكثر مبيعاً)', price: 0 },
          { name: 'سلطة الزعتر (الأكثر مبيعاً)', price: 0 },
          { name: 'سلطة الماتاي (الأكثر مبيعاً)', price: 0 },
          { name: 'سلطة سيزر', price: 0 },
          { name: 'سلطة شمندر', price: 0 },
          { name: 'سلطة فتوش', price: 0 },
          { name: 'سلطة تبولة', price: 0 },
          { name: 'سلطة فاصوليا حمراء', price: 0 },
          { name: 'سلطة يونانية', price: 0 },
          { name: 'سلطة كول سلو', price: 0 },
          { name: 'سلطة جرجير بالرمان', price: 0 },
          { name: 'سلطة فتة', price: 0 },
          { name: 'متبل', price: 0 },
          { name: 'بابا غنوج', price: 0 },
          { name: 'سلطة الكينوا *جديد*', price: 0 },
          { name: 'سلطة التمر*جديد*', price: 0 },
          { name: 'سلطة جرجير بالفراولة *جديد*', price: 0 },
          { name: 'سلطة المانجو *جديد*', price: 0 },
          { name: 'روبيان *جديد*', price: 0 },
          { name: 'سلطة الحلوم *جديد*', price: 0 }
        ]
      },      
      {
        id: 'sweet',
        title: 'إختيارك من الحلويات',
        required: true,
        min: limits.sweet.min,
        max: limits.sweet.max,
        options: [
  { name: 'حلو على إختيار الشيف العمومي', price: 0 },
  { name: 'سخان أم علي (الأكثر مبيعاً)', price: 0 },
  { name: 'كاسات كيك الزعفران (الأكثر مبيعاً)', price: 0 },
  { name: 'كاسات كريم كراميل (24 كاسة ميني)', price: 0 },
  { name: 'كاسات موس شوكولات (24 كاسة ميني)', price: 0 },
  { name: 'كاسات مهلبية (24 كاسة ميني)', price: 0 },
  { name: 'فواكه مشكلة سلايز', price: 0 },
  { name: 'سخانة كنافة بالجبن', price: 0 },
  { name: 'حلويات شرقية', price: 0 },
  { name: 'سلطة الفواكه', price: 0 },
  { name: 'كيكة المانجو', price: 0 },
  { name: 'موس شوكوليت كيك', price: 0 },
  { name: 'موس لوتس كيك', price: 0 },
  { name: 'كيكة التوت', price: 0 },

  { name: 'كيكة الفراولة', price: 0 },
  { name: 'ميني تشيز كيك فراولة (24 قطعة)', price: 0 },
  { name: 'ميني تشيز كيك مانجو (24 قطعة)', price: 0 },
  { name: 'ميني تشيز كيك لوتس (24 قطعة)', price: 0 },
  { name: 'ميني تشيز كيك توت (24 قطعة)', price: 0 },
  { name: 'ميني تشيز كيك شوكولات (24 قطعة)', price: 0 },
  { name: 'ميني تشيز كيك تيرامسو (24 قطعة)', price: 0 },
  { name: 'سخان بودنغ شوكولات', price: 0 },
  { name: ' سخان بسبوسة بالقشطة ', price: 0 }
]
      }, 
      
      // الأقسام الإضافية
      {
        id: 'extraMainDishes',
        title: 'سخانات إضافية (زيادة على الحساب)(إختياري)',
        required: false,
        min: 0,
     options: additionPrices['extraMainDishes'] || []
      },
      {
        id: 'extraSalads',
        title: 'مقبلات و سلطات إضافية (زيادة على الحساب)(إختياري)',
        required: false,
        min: 0,
        options: additionPrices['extraSalads'] || []
      },      
      {
        id: 'extraSweet',
        title: 'حلويات إضافية (زيادة على الحساب )(إختياري)',
        required: false,
        min: 0,
        options: additionPrices['extraSweet'] || []
      },         
    ];
  }

  if (product?.category === "بوفيهات الريوق") {
    categorySections = [
      {
        id: 'heaterTypes',
        title: 'شكل السخان:',
        required: false,
        min: 1,
        max: 1,
        options: [
          { name: 'ڤولدن (6 لتر)', price: 0 },
          { name: 'صدفي ابيض (6 لتر)', price: 0 },
          { name: 'خشبي (6 لتر)', price: 0 },
          { name: 'فراشة (6 لتر)', price: 0 },
          { name: 'سيلفر مستطيل (6 لتر)', price: 0 },
          { name: 'هندج ذهبي (6 لتر)', price: 0 },
          { name: 'هندج سيلفر (6 لتر)', price: 0 },
          { name: 'النخلة (5 لتر)', price: 0 },
          { name: 'كناري (6 لتر)', price: 0 },          
          { name: 'مظلع سيلفر (6 لتر)', price: 0 },
          { name: 'مظلع ذهبي (6 لتر)', price: 0 },
          { name: 'قاعدة سيلفر (6 لتر)', price: 0 },
          { name: 'قاعدة ذهبي (6 لتر)', price: 0 },
          { name: 'مدور سيلفر (6 لتر)', price: 0 },
          { name: 'مدور ذهبي (6 لتر)', price: 0 },
          { name: 'مربع سيلفر (6 لتر)', price: 0 },
          { name: 'مربع ذهبي (5 لتر)', price: 0 },
          { name: 'ثريا ذهبي (5 لتر)', price: 0 },
          { name: 'ثريا سيلفر (5 لتر)', price: 0 },         
        ]
      },
      {
        id: 'mainDishes',
        title: 'اختيارك من الأطباق الرئيسية:',
        required: false,
        min: 4,
        max: 4,
        options: [
          { name: 'سخان على اختيار الشيف العمومي', price: 0 },
          { name: 'عيش شيئت بالدجاج والكريمة (الأكثر مبيعاً)', price: 0 },
          { name: 'كباب بكريمة المشروم وشيت (الأكثر مبيعاً)', price: 0 },
          { name: 'كرات البطاط (الأكثر مبيعاً)', price: 0 },
          { name: 'معكرونة رافيولي (الأكثر مبيعاً)', price: 0 },
          { name: 'محاشي (الأكثر مبيعاً)', price: 0 },
          { name: 'دجاج سوبت اند ساور (الأكثر مبيعاً)', price: 0 },
          { name: 'عيش شمندر باللحم والكريمة (الأكثر مبيعاً)', price: 0 },
          { name: 'برياني دجاج (الأكثر مبيعاً)', price: 0 },
          { name: 'بينك باستا', price: 0 },
          { name: 'باستا بيتزا', price: 0 },
          { name: 'لازانيا', price: 0 },
          { name: 'معكرونة بشاميل', price: 0 },
          { name: 'فوتشيني', price: 0 },
          { name: 'سباغيتي تشاينسز', price: 0 },
          { name: 'عيش الزعفران مع بترتشيكن', price: 0 },
          { name: 'برياني لحم', price: 0 },
          { name: 'مكبوس دجاج', price: 0 },
          { name: 'مكبوس لحم', price: 0 },
          { name: 'ربع خروف', price: 0 },
          { name: 'مربين', price: 0 },
          { name: 'مرقة لحم مع البامية', price: 0 },
          { name: 'جريش', price: 0 },
          { name: 'هريس', price: 0 },
          { name: 'مرقوق', price: 0 },
          { name: 'كبة باللبن', price: 0 },
          { name: 'روبيان بالزعفران والكريمة', price: 0 },
          { name: 'ستيك لحم مع صوص المشروم', price:0 },
          { name: 'مشاوي مشكلة', price: 0 },
          { name: 'دجاج تندوري', price: 0 },
          { name: 'فاهيتا دجاج', price: 0 },
          { name: 'مسخن دجاج', price: 0 },
          { name: 'مكس كبب', price: 0 },
          { name: 'سبرنق رول', price: 0 },
          { name: 'شيش برك', price: 0 },
          { name: 'باستا بالترتشيكن *NEW*', price: 0 },
          { name: 'باستا الدجاج بالمشروم *NEW*', price: 0 },
          { name: 'سباغيتي بولونيز *NEW*', price: 0 },
          { name: 'باستا شورت ريبيز مشوي *NEW*', price: 0 },
          { name: 'بينك روزيتو ريبز *NEW*', price: 0 },
          { name: 'روزيتو بترتشيكن *NEW*', price: 0 },
          { name: 'تشكن روزيتو بالزعفران *NEW*', price: 0 },
          { name: 'باستا الدجاج بالباذنجان *NEW*', price: 0 },
          { name: 'كرات الفطر بالجبن *NEW*', price: 0 },
          { name: 'ميني سلايدر لحم *NEW*', price: 0 }
        ]
      },
      {
        id: 'salads',
        title: 'إختيارك من السلطات و المقبلات',
        required: true,
        min: 2,
        max: 2,
        options: [
          { name: 'سلطة على اختيار الشيف العمومي', price: 0 },
          { name: 'سلطة ناتشوز (الأكثر مبيعاً)', price: 0 },
          { name: 'سلطة الزعتر (الأكثر مبيعاً)', price: 0 },
          { name: 'سلطة الماتاي (الأكثر مبيعاً)', price: 0 },
          { name: 'سلطة سيزر', price: 0 },
          { name: 'سلطة شمندر', price: 0 },
          { name: 'سلطة فتوش', price: 0 },
          { name: 'سلطة تبولة', price: 0 },
          { name: 'سلطة فاصوليا حمراء', price: 0 },
          { name: 'سلطة يونانية', price: 0 },
          { name: 'سلطة كول سلو', price: 0 },
          { name: 'سلطة جرجير بالرمان', price: 0 },
          { name: 'سلطة فتة', price: 0 },
          { name: 'متبل', price: 0 },
          { name: 'بابا غنوج', price: 0 },
          { name: 'سلطة الكينوا *جديد*', price: 0 },
          { name: 'سلطة التمر*جديد*', price: 0 },
          { name: 'سلطة جرجير بالفراولة *جديد*', price: 0 },
          { name: 'سلطة المانجو *جديد*', price: 0 },
          { name: 'روبيان *جديد*', price: 0 },
          { name: 'سلطة الحلوم *جديد*', price: 0 }
        ]
      },      

      // الأقسام الإضافية
      {
        id: 'mainDishes',
        title: 'سخانات إضافية (زيادة على الحساب)(إختياري)',
        required: false,
        min: 0,
        options: additionPrices['extraMainDishes'] || []
      },
      {
        id: 'salads',
        title: 'مقبلات و سلطات إضافية (زيادة على الحساب)(إختياري)',
        required: false,
        min: 0,
        options: additionPrices['extraSalads'] || []
      },      
      {
        id: 'sweet',
        title: 'حلويات إضافية (زيادة على الحساب )(إختياري)',
        required: false,
        min: 0,
        options: additionPrices['extraSweet'] || []
      },         
    ];
  }

  if (product?.title === "( أشكال ) طاولة طعام مع 6 كراسي") {
    categorySections = [
      {
        id: 'table shape',
        title: ': شكل طاولة الطعام',
        required: true,
        min: 1,
        max: 1,
        options: [
          { name: 'طاولة طعام مستطيلة', price: 0 },
          { name: 'طاولة طعام دائرية', price: 0 },
        ]
      },
      {
        id: 'table color',
        title: ': لون سطح زجاج طاولة الطعام',
        required: true,
        min: 1,
        max: 1,
        options: [
          { name: 'لون سطح زجاج طاولة الطعام (شفاف)', price: 0 },
          { name: 'لون سطح طاولة الطعام (أسود)', price: 0 },
        ]
      },
      {
        id: 'table foot',
        title: ': لون رجل طاولة الطعام',
        required: true,
        min: 1,
        max: 1,
        options: [
          { name: 'لون رجل طاولة الطعام (لون ذهبي)', price: 0 },
          { name: 'لون رجل طاولة الطعام (لون سيلفر)', price: 0 },
          { name: 'لون رجل طاولة الطعام (لون أسود)', price: 0 },         
        ]
      },      
      {
        id: 'chair color',
        title: ': شكل كرسي طاولة الطعام ',
        required: true,
        min: 1,
        max: 1,
        options: [
          { name: 'عدد 6 كراسي (أكريليلك شفاف vip)', price: 0 },
          { name: 'عدد 6 كراسي (نابليون سيلفر)', price: 0 },
          { name: 'عدد 6 كراسي (نابليون ذهبي)', price: 0 },          
        ]
      },      
      {
        id: 'chair sponge',
        title: ': لون خام إسفنج الكرسي',
        required: true,
        min: 1,
        max: 1,
        options: [
          { name: '(لون ذهبي)عدد 6 تكاية خام  إسفنج', price: 0 },
          { name: 'عدد 6 تكاية خام (لون أسود)', price: 0 },
          { name: 'عدد 6 تكاينة خام (لون سيلفر)', price: 0 },
          { name: 'عدد 6 تكاية خام (لون أبيض)', price: 0 }          
        ]
      }      
    ];
  }

  return [dateSection, ...categorySections];
};



