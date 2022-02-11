export let carCategory = {
    data: [
        { label: '其他', group: true, children: [{ label: '其他', value: '0' }] },
        {
          label: '桥车',
          group: true,
          children: [
            { label: '桥车', value: '1' },
            { label: '越野车', value: '2' },
            { label: '商务车', value: '3' },
          ],
        },
        {
          label: '货车',
          group: true,
          children: [
            { label: '小型货车', value: '4' },
            { label: '大型货车', value: '5' },
          ],
        },
        {
          label: '客车',
          group: true,
          children: [
            { label: '轻客', value: '6' },
            { label: '小型客车', value: '7' },
            { label: '大型客车', value: '8' },
          ],
        },
        {
          label: '三轮车',
          group: true,
          children: [{ label: '三轮车', value: '9' }],
        },
        {
          label: '面包车',
          group: true,
          children: [{ label: '微面', value: '10' }],
        },
        {
          label: '皮卡车',
          group: true,
          children: [{ label: '皮卡车', value: '11' }],
        },
        {
          label: '专用车',
          group: true,
          children: [
            { label: '挂车', value: '12' },
            { label: '混凝土搅拌车', value: '13' },
            { label: '罐车', value: '14' },
            { label: '随吊车', value: '15' },
            { label: '消防车', value: '16' },
            { label: '渣土车', value: '17' },
            { label: '押运车', value: '18' },
            { label: '工程抢修车', value: '19' },
            { label: '救援车', value: '20' },
            { label: '栏板卡车', value: '21' },
          ],
        },
    ]
};
