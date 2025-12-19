import React from 'react';

// 画像パスを定義 
const SUN_PATH = '/sun.png';
const SUNABAR_CLOUD_PATH = '/sunabar_cloud.png';

/*
 推し活サービス「OshiPay」のヘッダー
 */
const SimpleOshiHeader: React.FC = () => {
  return (
    <div style={{ backgroundColor: '#D1EEFF', padding: '20px', position: 'relative', textAlign: 'center' }}>
      
      {/* 太陽ちゃん (sun.png) の表示 */}
      <img 
        src={SUN_PATH} 
        alt="Smiling Sun Icon" 
        style={{ position: 'absolute', top: '10px', right: '10px', width: '50px', height: '50px' }} 
      />
      
      {/* タイトル部分 */}
      <h1 style={{ fontSize: '30px' }}>推ししか勝たん貯金</h1>

      <p>推しへの気持ちを、残高に。</p>

      <p style={{ marginTop: '50px' }}>推し活は、</p>
      <p>騒いでも、静かでも、語ってもいい。</p>

      <p style={{ marginTop: '30px' }}>このアプリは、</p>
      <p>そのすべてを「等価な入金」として扱います。</p>
      
      {/* 推し情報カード部分 */}
      <div style={{ backgroundColor: 'white', padding: '20px', margin: '20px 0', borderRadius: '15px', display: 'flex', alignItems: 'center' }}>
        
        {/* sunabarちゃん (sunabar_cloud.png) の表示 */}
        <img 
          src={SUNABAR_CLOUD_PATH} 
          alt="Sunabar-chan Icon" 
          style={{ width: '80px', height: '80px', marginRight: '15px' }} 
        />

        {/* 推し情報テキスト */}
        <div>
          <p style={{ fontWeight: 'bold' }}>推し: sunabarちゃん ✨</p>
          <p style={{ fontSize: 'small', color: '#888' }}>いつも応援してくれてありがとう❤️</p>
        </div>
      </div>
      
    </div>
  );
};

export default SimpleOshiHeader;