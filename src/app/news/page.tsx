'use client'

import React, { useState } from 'react';
import { Newspaper, Calendar, Clock, ChevronRight, X } from 'lucide-react';
import styles from './news.module.css';
import { news, NewsItem } from '@/lib/data/news';

export default function NewsFeed() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [readingArticle, setReadingArticle] = useState<NewsItem | null>(null);

  // Category tags
  const categories = ['All', 'breaking', 'preview', 'report', 'injury', 'announcement'];

  // Filtering Logic
  const filteredNews = news.filter(n => {
    return activeCategory === 'All' || n.category === activeCategory;
  });

  return (
    <div className={`${styles.container} animate-fade-in`}>
      {/* Intro Header */}
      <section className={styles.intro}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Newspaper style={{ color: 'var(--accent-gold)' }} /> Live Tournament News Feed
          </h1>
          <p className={styles.subtitle}>
            Stay informed with the latest breaking scoops, previews, injury bulletins, and tactical reports.
          </p>
        </div>

        {/* Categories Bar */}
        <div className={styles.filters}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterBtnActive : ''}`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </section>

      {/* Grid of news */}
      <section className={styles.grid}>
        {filteredNews.map(item => (
          <div 
            key={item.id} 
            className={`${styles.card} glass-card`} 
            onClick={() => setReadingArticle(item)}
          >
            <div className={styles.cardBanner} style={{ background: item.imageGradient }}>
              <span className={styles.categoryTag}>{item.category}</span>
              <div className={styles.cardMeta}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Calendar size={10} /> {item.publishedAt}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Clock size={10} /> {item.readTime}
                </span>
              </div>
            </div>

            <div className={styles.cardBody}>
              <div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardSummary}>{item.summary}</p>
              </div>

              <span className={styles.readMore}>
                Read full article <ChevronRight size={12} />
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* Reading modal overlay */}
      {readingArticle && (
        <div className={styles.modalOverlay} onClick={() => setReadingArticle(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setReadingArticle(null)}>
              <X size={24} />
            </button>

            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span className={styles.categoryTag} style={{ background: 'var(--accent-gold)', color: '#000' }}>
                {readingArticle.category}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Published {readingArticle.publishedAt} • {readingArticle.readTime}
              </span>
            </div>

            <h2 className={styles.modalTitle}>{readingArticle.title}</h2>
            
            {/* Image banner mock inside article */}
            <div 
              style={{ 
                height: '180px', 
                background: readingArticle.imageGradient, 
                borderRadius: '12px',
                marginBottom: '1.5rem',
                opacity: 0.8
              }}
            ></div>

            <p style={{ fontStyle: 'italic', fontWeight: 600, color: 'var(--text-primary)', borderLeft: '3px solid var(--accent-gold)', paddingLeft: '0.75rem', fontSize: '0.9rem', lineHeight: 1.4 }}>
              {readingArticle.summary}
            </p>

            <p className={styles.modalText}>
              {readingArticle.content}
            </p>

            <div style={{ marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {readingArticle.tags.map(tag => (
                <span 
                  key={tag} 
                  style={{
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-secondary)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 700
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
