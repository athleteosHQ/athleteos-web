import { ImageResponse } from 'next/og'

import {
  OG_IMAGE_ALT,
  OG_IMAGE_DESCRIPTION,
  OG_IMAGE_TITLE,
} from '@/lib/seo'

export const alt = OG_IMAGE_ALT
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#09090B',
          color: '#FAFAFA',
          padding: '56px 64px',
          fontFamily: 'Inter, system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at top right, rgba(255,255,255,0.08), rgba(9,9,11,0) 36%), linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
          }}
        />

        <div
          style={{
            position: 'absolute',
            right: '-80px',
            top: '-120px',
            width: '420px',
            height: '420px',
            borderRadius: '999px',
            border: '1px solid rgba(255,255,255,0.06)',
            opacity: 0.6,
          }}
        />

        <div
          style={{
            position: 'absolute',
            right: '80px',
            bottom: '96px',
            width: '280px',
            height: '280px',
            borderRadius: '999px',
            border: '1px solid rgba(255,255,255,0.05)',
            opacity: 0.45,
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'stretch',
            gap: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              width: '58%',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                }}
              >
                <div
                  style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '999px',
                    background: '#FAFAFA',
                    boxShadow: '0 0 24px rgba(255,255,255,0.24)',
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    fontSize: 34,
                    fontWeight: 800,
                    letterSpacing: '-0.04em',
                  }}
                >
                  <span>athlete</span>
                  <span style={{ color: '#A1A1AA' }}>OS</span>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  fontSize: 64,
                  lineHeight: 1.02,
                  fontWeight: 800,
                  letterSpacing: '-0.05em',
                  maxWidth: '640px',
                }}
              >
                {OG_IMAGE_TITLE}
              </div>

              <div
                style={{
                  display: 'flex',
                  fontSize: 26,
                  lineHeight: 1.35,
                  color: 'rgba(250,250,250,0.72)',
                  maxWidth: '560px',
                }}
              >
                {OG_IMAGE_DESCRIPTION}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                fontSize: 18,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(250,250,250,0.4)',
              }}
            >
              Training. Nutrition. Recovery. One read.
            </div>
          </div>

          <div
            style={{
              width: '34%',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
                borderRadius: '28px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.03)',
                padding: '28px',
                boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  fontSize: 14,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(250,250,250,0.38)',
                }}
              >
                Founding Member
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: 44,
                  fontWeight: 800,
                  letterSpacing: '-0.05em',
                }}
              >
                First Cohort
              </div>
              <div
                style={{
                  height: 1,
                  width: '100%',
                  background: 'rgba(255,255,255,0.08)',
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', fontSize: 14, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(250,250,250,0.38)' }}>
                  System Promise
                </div>
                <div style={{ display: 'flex', fontSize: 28, lineHeight: 1.2, fontWeight: 700 }}>
                  Your app tracks numbers. It doesn&apos;t diagnose the stall.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  )
}
