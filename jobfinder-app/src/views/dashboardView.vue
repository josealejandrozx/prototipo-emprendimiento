<template>
  <div class="dashboard">
    <!-- Vista para CANDIDATOS -->
    <template v-if="user?.role === 'candidate'">
      <div class="candidate-dashboard">
        <header class="header">
          <div class="header-content">
            <div class="header-left">
              <div class="logo">
                <div class="logo-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="white" stroke="white" stroke-width="1.5"/>
                    <circle cx="12" cy="9" r="3" fill="#4f46e5" stroke="white" stroke-width="1.5"/>
                  </svg>
                </div>
                <span class="logo-text">WorkNear</span>
              </div>
              <span class="role-badge">Candidato</span>
            </div>
            <div class="header-right">
              <div class="user-menu">
                <router-link to="/profile" class="profile-link">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </router-link>
                <button class="nav-link" @click="viewMyApplications">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <span>Mis postulaciones</span>
                </button>
                <span class="user-avatar">{{ user.name?.charAt(0) || 'U' }}</span>
                <span class="user-name">{{ user.name?.split(' ')[0] || 'Usuario' }}</span>
                <button class="logout-btn" @click="handleLogout">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l4-4-4-4M20 13H9"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main class="main">
          <!-- Filtros -->
          <div class="filters-section">
            <div class="section-title">
              <h3>Encontrar trabajo</h3>
              <p>{{ availableJobs.length }} oportunidades disponibles</p>
            </div>

            <div class="filters-scroll">
              <div class="filter-chips">
                <button 
                  v-for="cat in categories" 
                  :key="cat.value"
                  :class="['chip', { active: filters.category === cat.value }]"
                  @click="filters.category = filters.category === cat.value ? '' : cat.value">
                  {{ cat.label }}
                </button>
              </div>

              <div class="filter-actions">
                <button class="filter-btn" @click="showFilters = !showFilters">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="4" y1="6" x2="20" y2="6"/>
                    <line x1="8" y1="12" x2="16" y2="12"/>
                    <line x1="10" y1="18" x2="14" y2="18"/>
                  </svg>
                  Filtros
                </button>
                <button class="filter-btn nearby-btn" @click="filterNearby">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    <circle cx="12" cy="9" r="3"/>
                  </svg>
                  {{ userLocation ? 'Cerca de ti' : 'Cerca de mí' }}
                </button>
              </div>
            </div>

            <div v-if="showFilters" class="filter-panel">
              <div class="filter-group">
                <label>Tipo de empleo</label>
                <div class="chip-group">
                  <button 
                    v-for="type in jobTypes" 
                    :key="type.value"
                    :class="['chip small', { active: filters.type === type.value }]"
                    @click="filters.type = filters.type === type.value ? '' : type.value">
                    {{ type.label }}
                  </button>
                </div>
              </div>
              <div class="filter-group">
                <label>Experiencia requerida</label>
                <div class="chip-group">
                  <button 
                    v-for="exp in experienceLevels" 
                    :key="exp.value"
                    :class="['chip small', { active: filters.experience_range === exp.value }]"
                    @click="filters.experience_range = filters.experience_range === exp.value ? '' : exp.value">
                    {{ exp.label }}
                  </button>
                </div>
              </div>
              <button class="btn-clear-filters" @click="clearFilters">Limpiar todos los filtros</button>
            </div>
          </div>

          <!-- Vacantes disponibles -->
          <div class="jobs-section">
            <div class="section-header">
              <h3>Vacantes disponibles</h3>
            </div>
            
            <div v-if="availableJobs.length === 0" class="empty-state">
              <div class="empty-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
              </div>
              <h4>No hay vacantes disponibles</h4>
              <p>No encontramos trabajos que coincidan con tus filtros</p>
              <button class="btn-outline" @click="clearFilters">Limpiar filtros</button>
            </div>

            <div v-else class="jobs-list">
              <div v-for="job in availableJobs" :key="job.id" class="job-card" @click="viewJobDetails(job)">
                <div class="job-card-header">
                  <div class="company-avatar">
                    <span>{{ job.company?.charAt(0) || 'E' }}</span>
                  </div>
                  <div class="job-info">
                    <h4>{{ job.title }}</h4>
                    <p class="company-name">{{ job.company }}</p>
                  </div>
                  <span class="job-type-badge">{{ job.type }}</span>
                </div>
                <p class="job-description">{{ truncateText(job.description, 100) }}</p>
                <div class="job-details">
                  <span class="detail">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    </svg>
                    {{ job.location_address?.split(',')[0] || 'Montería' }}
                  </span>
                  <span class="detail">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {{ job.experience_required || 'No especificado' }}
                  </span>
                  <span class="detail salary">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="12" y1="1" x2="12" y2="23"/>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                    {{ job.salary_range || 'No especificado' }}
                  </span>
                </div>
                <div class="job-card-footer">
                  <button class="btn-chat" @click.stop="startChat(job)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    Chatear
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Mis postulaciones -->
          <div class="jobs-section applications-section">
            <div class="section-header">
              <h3>Mis postulaciones</h3>
              <span class="badge">{{ applications.length }} aplicadas</span>
            </div>

            <div v-if="applications.length === 0" class="empty-state small">
              <p>Aún no has aplicado a ninguna vacante</p>
            </div>

            <div v-else class="jobs-list">
              <div v-for="app in applications" :key="app.id" class="job-card application-card">
                <div class="job-card-header">
                  <div class="company-avatar small">
                    <span>{{ app.company?.charAt(0) || 'E' }}</span>
                  </div>
                  <div class="job-info">
                    <h4>{{ app.jobTitle }}</h4>
                    <p class="company-name">{{ app.company }}</p>
                  </div>
                  <span class="status-badge" :class="app.status || 'pending'">
                    {{ getStatusText(app.status) }}
                  </span>
                </div>
                <div class="job-details">
                  <span class="detail">Aplicaste el {{ app.appliedAt }}</span>
                </div>
                <div class="job-card-footer">
                  <button class="btn-chat" @click="continueChat(app)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    Continuar chat
                  </button>
                  <button class="btn-cancel" @click="cancelApplication(app)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </template>

    <!-- Vista para EMPLEADORES -->
    <template v-else-if="user?.role === 'employer'">
      <div class="employer-dashboard">
        <header class="header">
          <div class="header-content">
            <div class="header-left">
              <div class="logo">
                <div class="logo-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="white" stroke="white" stroke-width="1.5"/>
                    <circle cx="12" cy="9" r="3" fill="#4f46e5" stroke="white" stroke-width="1.5"/>
                  </svg>
                </div>
                <span class="logo-text">WorkNear</span>
              </div>
              <span class="role-badge employer">Empleador</span>
            </div>
            <div class="header-right">
              <div class="user-menu">
                <router-link to="/profile" class="profile-link">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </router-link>
                <span class="user-avatar">{{ user.company_name?.charAt(0) || user.name?.charAt(0) || 'E' }}</span>
                <span class="user-name">{{ user.company_name?.split(' ')[0] || user.name?.split(' ')[0] || 'Empresa' }}</span>
                <button class="logout-btn" @click="handleLogout">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l4-4-4-4M20 13H9"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main class="main">
          <!-- Publicar vacante -->
          <div class="publish-card">
            <div class="publish-header">
              <div class="icon-circle">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </div>
              <div>
                <h3>Publicar nueva vacante</h3>
                <p>Completa el formulario para encontrar al candidato ideal</p>
              </div>
              <button class="btn-toggle-form" @click="showJobForm = !showJobForm">
                {{ showJobForm ? 'Cancelar' : 'Crear vacante' }}
              </button>
            </div>

            <div v-if="showJobForm" class="job-form">
              <form @submit.prevent="publishJob">
                <div class="form-row">
                  <div class="form-group">
                    <label>Título del puesto</label>
                    <input type="text" v-model="newJob.title" placeholder="Ej: Desarrollador Frontend" required>
                  </div>
                  <div class="form-group">
                    <label>Categoría</label>
                    <select v-model="newJob.category" required>
                      <option value="">Seleccionar</option>
                      <option v-for="cat in categories" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label>Descripción del puesto</label>
                  <textarea v-model="newJob.description" rows="4" placeholder="Describe las funciones, requisitos y beneficios..." required></textarea>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>Tipo de empleo</label>
                    <select v-model="newJob.type" required>
                      <option v-for="type in jobTypes" :key="type.value" :value="type.value">{{ type.label }}</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Experiencia requerida</label>
                    <select v-model="newJob.experience_required" required>
                      <option v-for="exp in experienceLevels" :key="exp.value" :value="exp.value">{{ exp.label }}</option>
                    </select>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>Rango salarial</label>
                    <input type="text" v-model="newJob.salary_range" placeholder="Ej: $2.000.000 - $2.500.000">
                  </div>
                  <div class="form-group">
                    <label>Ubicación</label>
                    <input type="text" v-model="newJob.location_address" placeholder="Dirección en Montería" required>
                  </div>
                </div>

                <button type="submit" class="btn-submit">Publicar vacante</button>
              </form>
            </div>
          </div>

          <!-- Mis vacantes con solicitudes -->
          <div class="jobs-section">
            <div class="section-header">
              <h3>Mis vacantes activas</h3>
              <span class="badge">{{ myJobs.filter(j => j.is_active).length }} activas · {{ myJobs.length }} total</span>
            </div>

            <div v-if="myJobs.length === 0" class="empty-state">
              <div class="empty-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="3" y="7" width="18" height="14" rx="2"/>
                  <line x1="8" y1="3" x2="16" y2="3"/>
                </svg>
              </div>
              <h4>No tienes vacantes publicadas</h4>
              <p>Comienza publicando tu primera oferta de trabajo</p>
            </div>

            <div v-else class="jobs-list">
              <div v-for="job in myJobs" :key="job.id" class="job-card employer-card">
                <div class="job-status" :class="job.is_active ? 'active' : 'closed'">
                  {{ job.is_active ? 'Activa' : 'Cerrada' }}
                </div>
                <div class="job-card-header">
                  <div class="job-info">
                    <h4>{{ job.title }}</h4>
                    <p class="posted-date">Publicado el {{ job.posted_at }}</p>
                  </div>
                </div>
                <p class="job-description">{{ truncateText(job.description, 80) }}</p>
                <div class="job-details">
                  <span class="detail">{{ job.category }}</span>
                  <span class="detail">{{ job.type }}</span>
                  <span class="detail">{{ job.experience_required }}</span>
                </div>

                <!-- Solicitudes recibidas expandibles -->
                <div class="applications-received">
                  <div class="applications-header" @click="toggleApplications(job.id)">
                    <span>📋 Solicitudes recibidas ({{ getApplicationsForJob(job.id).length }})</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" :style="{ transform: expandedJobId === job.id ? 'rotate(180deg)' : 'rotate(0deg)' }">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                  <div v-if="expandedJobId === job.id" class="applications-list">
                    <div v-for="app in getApplicationsForJob(job.id)" :key="app.id" class="application-item">
                      <div class="application-info">
                        <div class="candidate-avatar">{{ app.candidateName?.charAt(0) || 'C' }}</div>
                        <div class="candidate-details">
                          <strong>{{ app.candidateName }}</strong>
                          <span class="applied-date">Aplicó el {{ app.appliedAt }}</span>
                          <span class="app-status" :class="app.status || 'pending'">{{ getStatusText(app.status) }}</span>
                        </div>
                      </div>
                      <div class="application-actions">
                        <button class="btn-view-profile" @click="viewCandidateProfile(app)">👤 Ver perfil</button>
                        <button class="btn-chat-small" @click="startChatWithCandidate(app)">💬 Chatear</button>
                        <button v-if="app.status === 'pending'" class="btn-accept" @click="acceptApplication(app)">✓ Aceptar</button>
                        <button v-if="app.status === 'pending'" class="btn-reject" @click="rejectApplication(app)">✗ Rechazar</button>
                        <span v-if="app.status === 'accepted'" class="accepted-badge">✅ Aceptado</span>
                        <span v-if="app.status === 'rejected'" class="rejected-badge">❌ Rechazado</span>
                      </div>
                    </div>
                    <div v-if="getApplicationsForJob(job.id).length === 0" class="no-applications">Aún no hay solicitudes para esta vacante</div>
                  </div>
                </div>

                <div class="job-card-footer employer-footer">
                  <button class="btn-toggle" @click="toggleJobStatus(job)">
                    {{ job.is_active ? 'Cerrar' : 'Reabrir' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </template>

    <!-- Modal de detalles del trabajo -->
    <div v-if="selectedJob" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <div class="company-badge">
            <span>{{ selectedJob.company?.charAt(0) || 'E' }}</span>
          </div>
          <div class="modal-title">
            <h2>{{ selectedJob.title }}</h2>
            <p>{{ selectedJob.company }}</p>
          </div>
          <button class="modal-close" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="info-grid">
            <div class="info-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              </svg>
              <span>{{ selectedJob.location_address?.split(',')[0] || 'Montería' }}</span>
            </div>
            <div class="info-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>{{ selectedJob.experience_required || 'No especificado' }}</span>
            </div>
            <div class="info-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              <span>{{ selectedJob.salary_range || 'No especificado' }}</span>
            </div>
            <div class="info-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="2" y="7" width="20" height="14" rx="2"/>
                <line x1="16" y1="21" x2="16" y2="15"/>
                <line x1="8" y1="21" x2="8" y2="15"/>
              </svg>
              <span>{{ selectedJob.type }}</span>
            </div>
          </div>
          <div class="modal-description">
            <h4>Descripción del puesto</h4>
            <p>{{ selectedJob.description }}</p>
          </div>
          <div class="modal-actions">
            <button class="btn-primary" @click="applyAndChat">Aplicar ahora</button>
            <button class="btn-outline" @click="closeModal">Cancelar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de perfil del candidato (para empleadores) -->
    <div v-if="viewingCandidate" class="modal-overlay" @click="closeCandidateModal">
      <div class="modal-content candidate-profile-modal" @click.stop>
        <div class="modal-header">
          <div class="company-badge">
            <span>{{ viewingCandidate.candidateName?.charAt(0) || 'C' }}</span>
          </div>
          <div class="modal-title">
            <h2>{{ viewingCandidate.candidateName }}</h2>
            <p>Candidato</p>
          </div>
          <button class="modal-close" @click="closeCandidateModal">×</button>
        </div>
        <div class="modal-body">
          <div class="info-section">
            <h4>Información de contacto</h4>
            <p><strong>📞 Teléfono:</strong> {{ viewingCandidate.candidatePhone || 'No especificado' }}</p>
            <p><strong>📧 Correo:</strong> {{ viewingCandidate.candidateEmail || 'No especificado' }}</p>
          </div>
          <div class="info-section">
            <h4>Habilidades</h4>
            <div class="skills-tags">
              <span v-for="skill in (viewingCandidate.candidateSkills || '').split(',')" :key="skill" class="skill-tag">{{ skill.trim() }}</span>
              <span v-if="!viewingCandidate.candidateSkills" class="no-data">No especificadas</span>
            </div>
          </div>
          <div class="info-section">
            <h4>Experiencia laboral</h4>
            <p>{{ viewingCandidate.candidateExperience || 'No especificada' }}</p>
          </div>
          <div class="info-section">
            <h4>Formación académica</h4>
            <p>{{ viewingCandidate.candidateEducation || 'No especificada' }}</p>
          </div>
          <div class="modal-actions">
            <button class="btn-primary" @click="startChatWithCandidate(viewingCandidate)">💬 Chatear con candidato</button>
            <button class="btn-outline" @click="closeCandidateModal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de chat -->
    <div v-if="chatOpen" class="modal-overlay" @click="closeChat">
      <div class="chat-modal" @click.stop>
        <div class="chat-header">
          <div class="chat-header-info">
            <div class="chat-avatar">{{ chatPartner?.charAt(0) || 'E' }}</div>
            <div>
              <h3>{{ chatPartner }}</h3>
              <p>{{ chatJobTitle || '' }}</p>
            </div>
          </div>
          <button class="modal-close" @click="closeChat">×</button>
        </div>
        <div class="chat-messages" ref="chatMessagesRef">
          <div v-for="msg in chatMessages" :key="msg.id" :class="['message', msg.sender === user?.role ? 'sent' : 'received']">
            <div class="message-bubble">
              <p>{{ msg.text }}</p>
            </div>
            <span class="time">{{ msg.time }}</span>
          </div>
        </div>
        <div class="chat-input">
          <input 
            type="text" 
            v-model="newMessage" 
            placeholder="Escribe un mensaje..." 
            @keyup.enter="sendMessage">
          <button @click="sendMessage">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { jobs as initialJobs } from '../data/jobs'

const router = useRouter()
const authStore = useAuthStore()
const user = computed(() => authStore.user)

// Datos generales
const allJobs = ref([...initialJobs])
const userLocation = ref(null)
const showJobForm = ref(false)
const showFilters = ref(false)
const myJobs = ref([])
const selectedJob = ref(null)
const chatOpen = ref(false)
const chatPartner = ref('')
const chatJobTitle = ref('')
const chatMessages = ref([])
const newMessage = ref('')
const chatMessagesRef = ref(null)
const applications = ref([])
const receivedApplications = ref([])
const expandedJobId = ref(null)
const viewingCandidate = ref(null)

// Filtros
const filters = ref({
  category: '',
  type: '',
  experience_range: '',
  min_salary: '',
  max_salary: ''
})

// Nuevo trabajo
const newJob = ref({
  title: '',
  description: '',
  category: '',
  type: '',
  experience_required: '',
  salary_range: '',
  location_address: '',
  posted_at: new Date().toISOString().split('T')[0],
  is_active: true,
  company: user.value?.company_name || user.value?.name
})

// Categorías
const categories = [
  { value: 'ventas', label: 'Ventas' },
  { value: 'tecnología', label: 'Tecnología' },
  { value: 'atención al cliente', label: 'Atención al cliente' },
  { value: 'construcción', label: 'Construcción' },
  { value: 'salud', label: 'Salud' },
  { value: 'educación', label: 'Educación' },
  { value: 'finanzas', label: 'Finanzas' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'transporte', label: 'Transporte' },
  { value: 'logística', label: 'Logística' },
  { value: 'seguridad', label: 'Seguridad' },
  { value: 'alimentos', label: 'Alimentos' },
  { value: 'administrativo', label: 'Administrativo' },
  { value: 'producción', label: 'Producción' },
  { value: 'otros', label: 'Otros' }
]

const jobTypes = [
  { value: 'tiempo completo', label: 'Tiempo completo' },
  { value: 'medio tiempo', label: 'Medio tiempo' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'por horas', label: 'Por horas' },
  { value: 'temporal', label: 'Temporal' }
]

const experienceLevels = [
  { value: 'Sin experiencia', label: 'Sin experiencia' },
  { value: '6 meses', label: '6 meses' },
  { value: '1 año', label: '1 año' },
  { value: '2 años', label: '2 años' },
  { value: '3 años', label: '3 años' },
  { value: '4 años', label: '4 años' },
  { value: '5 años', label: '5 años' },
  { value: '5+ años', label: '5+ años' }
]

// ========== FUNCIONES DE GUARDADO GLOBAL (DEFINIDAS ANTES DE USARSE) ==========
const guardarVacantesGlobales = () => {
  localStorage.setItem('global_jobs', JSON.stringify(allJobs.value))
}

const cargarVacantesGlobales = () => {
  const saved = localStorage.getItem('global_jobs')
  if (saved && JSON.parse(saved).length > 0) {
    allJobs.value = JSON.parse(saved)
  } else {
    allJobs.value = [...initialJobs]
    localStorage.setItem('global_jobs', JSON.stringify(allJobs.value))
  }
}

// Computed: trabajos disponibles (no aplicados)
const availableJobs = computed(() => {
  const appliedJobIds = applications.value.map(a => a.jobId)
  let result = allJobs.value.filter(job => !appliedJobIds.includes(job.id) && job.is_active !== false)

  if (filters.value.category) {
    result = result.filter(j => j.category === filters.value.category)
  }
  if (filters.value.type) {
    result = result.filter(j => j.type === filters.value.type)
  }
  if (filters.value.experience_range) {
    result = result.filter(j => j.experience_required === filters.value.experience_range)
  }

  return result
})

const truncateText = (text, maxLength) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const clearFilters = () => {
  filters.value = {
    category: '',
    type: '',
    experience_range: '',
    min_salary: '',
    max_salary: ''
  }
  userLocation.value = null
  showFilters.value = false
}
const filterNearby = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      userLocation.value = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
    }, () => {
      alert('No se pudo obtener tu ubicación')
    })
  }
}

const viewJobDetails = (job) => {
  selectedJob.value = job
}

const closeModal = () => {
  selectedJob.value = null
}

const getStatusText = (status) => {
  if (status === 'accepted') return 'Aceptado'
  if (status === 'rejected') return 'Rechazado'
  return 'En revisión'
}

// APLICAR Y CHAT
const applyAndChat = () => {
  if (selectedJob.value) {
    const job = selectedJob.value
    
    const application = {
      id: Date.now(),
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      appliedAt: new Date().toISOString().split('T')[0],
      status: 'pending'
    }
    applications.value.unshift(application)
    localStorage.setItem('applications', JSON.stringify(applications.value))
    
    receivedApplications.value.unshift({
      id: Date.now(),
      jobId: job.id,
      jobTitle: job.title,
      candidateName: user.value?.name,
      candidateId: user.value?.id,
      candidatePhone: user.value?.phone,
      candidateEmail: user.value?.email,
      candidateSkills: user.value?.skills,
      candidateExperience: user.value?.experience,
      candidateEducation: user.value?.education,
      appliedAt: new Date().toISOString().split('T')[0],
      status: 'pending'
    })
    localStorage.setItem('receivedApplications', JSON.stringify(receivedApplications.value))
    
    startChat(job)
    closeModal()
    
    alert(`✅ Has aplicado a: ${job.title}\n\nLa empresa ha sido notificada.`)
  }
}

// CANCELAR POSTULACIÓN
const cancelApplication = (application) => {
  if (confirm(`¿Estás seguro de que quieres cancelar tu postulación a "${application.jobTitle}"?`)) {
    const appIndex = applications.value.findIndex(a => a.id === application.id)
    if (appIndex !== -1) {
      applications.value.splice(appIndex, 1)
    }
    
    localStorage.setItem('applications', JSON.stringify(applications.value))
    
    const receivedIndex = receivedApplications.value.findIndex(r => r.jobId === application.jobId && r.candidateName === user.value?.name)
    if (receivedIndex !== -1) {
      receivedApplications.value.splice(receivedIndex, 1)
      localStorage.setItem('receivedApplications', JSON.stringify(receivedApplications.value))
    }
    
    alert(`✅ Has cancelado tu postulación a "${application.jobTitle}". La vacante está nuevamente disponible.`)
  }
}

const startChat = (job) => {
  chatPartner.value = job.company
  chatJobTitle.value = job.title
  chatMessages.value = [
    { id: 1, text: `Hola, me interesa la vacante de ${job.title}. ¿Podría darme más información?`, sender: user.value?.role, time: new Date().toLocaleTimeString() },
    { id: 2, text: `¡Hola! Claro, con gusto. ¿Qué te gustaría saber?`, sender: 'employer', time: new Date().toLocaleTimeString() }
  ]
  chatOpen.value = true
  nextTick(() => {
    if (chatMessagesRef.value) {
      chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
    }
  })
}

const continueChat = (application) => {
  chatPartner.value = application.company
  chatJobTitle.value = application.jobTitle
  chatMessages.value = [
    { id: 1, text: `Hola, quería consultar sobre mi postulación a ${application.jobTitle}`, sender: user.value?.role, time: new Date().toLocaleTimeString() },
    { id: 2, text: `Hola, gracias por tu interés. Estamos revisando tu perfil.`, sender: 'employer', time: new Date().toLocaleTimeString() }
  ]
  chatOpen.value = true
  nextTick(() => {
    if (chatMessagesRef.value) {
      chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
    }
  })
}

const closeChat = () => {
  chatOpen.value = false
  chatMessages.value = []
  newMessage.value = ''
}

const sendMessage = () => {
  if (newMessage.value.trim()) {
    chatMessages.value.push({
      id: Date.now(),
      text: newMessage.value,
      sender: user.value?.role,
      time: new Date().toLocaleTimeString()
    })
    newMessage.value = ''
    
    setTimeout(() => {
      chatMessages.value.push({
        id: Date.now() + 1,
        text: 'Gracias por tu mensaje. Te responderemos pronto.',
        sender: user.value?.role === 'candidate' ? 'employer' : 'candidate',
        time: new Date().toLocaleTimeString()
      })
    }, 1000)
  }
}

const viewMyApplications = () => {
  if (applications.value.length === 0) {
    alert('Aún no has aplicado a ninguna vacante')
  } else {
    const appList = applications.value.map((a, i) => 
      `${i + 1}. ${a.jobTitle} - ${a.company} (${getStatusText(a.status)})`
    ).join('\n')
    alert(`📋 Mis postulaciones:\n\n${appList}`)
  }
}

// EMPLEADORES
const getApplicationsForJob = (jobId) => {
  return receivedApplications.value.filter(a => a.jobId === jobId)
}

const toggleApplications = (jobId) => {
  expandedJobId.value = expandedJobId.value === jobId ? null : jobId
}

const viewCandidateProfile = (application) => {
  viewingCandidate.value = application
}

const closeCandidateModal = () => {
  viewingCandidate.value = null
}

const acceptApplication = (application) => {
  application.status = 'accepted'
  localStorage.setItem('receivedApplications', JSON.stringify(receivedApplications.value))
  
  const candidateApp = applications.value.find(a => a.jobId === application.jobId && a.company === application.jobTitle)
  if (candidateApp) {
    candidateApp.status = 'accepted'
    localStorage.setItem('applications', JSON.stringify(applications.value))
  }
  
  alert(`✅ Has aceptado la postulación de ${application.candidateName} para "${application.jobTitle}".`)
}

const rejectApplication = (application) => {
  if (confirm(`¿Rechazar la postulación de ${application.candidateName} para "${application.jobTitle}"?`)) {
    application.status = 'rejected'
    localStorage.setItem('receivedApplications', JSON.stringify(receivedApplications.value))
    
    const candidateApp = applications.value.find(a => a.jobId === application.jobId && a.company === application.jobTitle)
    if (candidateApp) {
      candidateApp.status = 'rejected'
      localStorage.setItem('applications', JSON.stringify(applications.value))
    }
    
    alert(`❌ Has rechazado la postulación de ${application.candidateName}.`)
  }
}

const startChatWithCandidate = (application) => {
  chatPartner.value = application.candidateName
  chatJobTitle.value = application.jobTitle
  chatMessages.value = [
    { id: 1, text: `Hola ${application.candidateName}, hemos recibido tu postulación para ${application.jobTitle}. ¿Podemos agendar una entrevista?`, sender: user.value?.role, time: new Date().toLocaleTimeString() },
    { id: 2, text: `¡Hola! Muchas gracias por contactarme. Estoy muy interesado en la oportunidad.`, sender: 'candidate', time: new Date().toLocaleTimeString() }
  ]
  chatOpen.value = true
  closeCandidateModal()
  nextTick(() => {
    if (chatMessagesRef.value) {
      chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
    }
  })
}

const publishJob = () => {
  if (!newJob.value.title || !newJob.value.description || !newJob.value.category || !newJob.value.type) {
    alert('Por favor completa todos los campos obligatorios')
    return
  }

  const jobToPublish = {
    id: Date.now(),
    ...newJob.value,
    company: user.value?.company_name || user.value?.name,
    is_active: true
  }
  
  myJobs.value.unshift(jobToPublish)
  allJobs.value.unshift(jobToPublish)
  guardarVacantesGlobales()
  
  showJobForm.value = false
  
  newJob.value = {
    title: '',
    description: '',
    category: '',
    type: '',
    experience_required: '',
    salary_range: '',
    location_address: '',
    posted_at: new Date().toISOString().split('T')[0],
    is_active: true,
    company: user.value?.company_name || user.value?.name
  }
  
  alert('Vacante publicada con éxito')
}

const toggleJobStatus = (job) => {
  job.is_active = !job.is_active
  guardarVacantesGlobales()
  alert(job.is_active ? 'Vacante reactivada' : 'Vacante cerrada')
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

onMounted(() => {
  cargarVacantesGlobales()
  
  const savedApplications = localStorage.getItem('applications')
  if (savedApplications) {
    applications.value = JSON.parse(savedApplications)
  }
  
  const savedReceived = localStorage.getItem('receivedApplications')
  if (savedReceived) {
    receivedApplications.value = JSON.parse(savedReceived)
  }
  
  if (user.value?.role === 'employer') {
    myJobs.value = allJobs.value.filter(j => j.company === (user.value?.company_name || user.value?.name))
  }
})
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f8fafc;
}

.header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 20;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  font-weight: 700;
  font-size: 1.25rem;
  color: #1e293b;
}

.role-badge {
  background: #e0e7ff;
  color: #4f46e5;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
}

.role-badge.employer {
  background: #fef3c7;
  color: #d97706;
}

.header-right .user-menu {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.profile-link {
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  display: flex;
  align-items: center;
  padding: 0.25rem;
  border-radius: 8px;
  transition: all 0.2s;
}

.profile-link:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.nav-link {
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  font-size: 0.8rem;
  transition: all 0.2s;
}

.nav-link:hover {
  background: #f1f5f9;
  color: #4f46e5;
}

.user-avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
}

.user-name {
  font-weight: 500;
  color: #334155;
  font-size: 0.9rem;
}

.logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.logout-btn:hover {
  color: #ef4444;
}

.main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
}

.filters-section {
  margin-bottom: 2rem;
}

.section-title {
  margin-bottom: 1rem;
}

.section-title h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.25rem;
}

.section-title p {
  font-size: 0.8rem;
  color: #64748b;
}

.filters-scroll {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-chips {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.chip {
  padding: 0.5rem 1rem;
  border-radius: 40px;
  border: 1px solid #e2e8f0;
  background: white;
  font-size: 0.8rem;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.chip.active {
  background: #4f46e5;
  border-color: #4f46e5;
  color: white;
}

.chip.small {
  padding: 0.35rem 0.8rem;
  font-size: 0.75rem;
}

.filter-actions {
  display: flex;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border-radius: 40px;
  border: 1px solid #e2e8f0;
  background: white;
  font-size: 0.8rem;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.filter-btn:hover {
  background: #f1f5f9;
}

.nearby-btn {
  background: #4f46e5;
  border-color: #4f46e5;
  color: white;
}

.filter-panel {
  margin-top: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
}

.filter-group {
  margin-bottom: 1rem;
}

.filter-group label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.chip-group {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-clear-filters {
  width: 100%;
  padding: 0.5rem;
  background: none;
  border: none;
  color: #ef4444;
  font-size: 0.8rem;
  cursor: pointer;
}

.jobs-section {
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
}

.badge {
  background: #e2e8f0;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.7rem;
  color: #475569;
}

.jobs-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.job-card {
  background: white;
  border-radius: 20px;
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;
}

.job-card:hover {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.application-card {
  border-left: 4px solid #4f46e5;
  cursor: default;
}

.application-card:hover {
  transform: none;
}

.job-card-header {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.company-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
  color: #4f46e5;
}

.company-avatar.small {
  width: 40px;
  height: 40px;
  font-size: 1rem;
}

.job-info {
  flex: 1;
}

.job-info h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.25rem;
}

.company-name, .posted-date {
  font-size: 0.75rem;
  color: #64748b;
}

.job-type-badge {
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
  background: #f1f5f9;
  border-radius: 20px;
  color: #475569;
}

.status-badge {
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
}

.status-badge.pending {
  background: #fef3c7;
  color: #d97706;
}

.status-badge.accepted {
  background: #dcfce7;
  color: #166534;
}

.status-badge.rejected {
  background: #fee2e2;
  color: #991b1b;
}

.job-description {
  font-size: 0.8rem;
  color: #475569;
  line-height: 1.5;
  margin-bottom: 0.75rem;
}

.job-details {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.detail {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.7rem;
  color: #64748b;
}

.detail.salary {
  color: #10b981;
}

.job-card-footer {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-chat {
  padding: 0.5rem 1rem;
  background: #4f46e5;
  border: none;
  border-radius: 40px;
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.btn-chat:hover {
  background: #4338ca;
}

.btn-cancel {
  padding: 0.5rem 1rem;
  background: #ef4444;
  border: none;
  border-radius: 40px;
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: #dc2626;
}

.btn-outline {
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 40px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.btn-outline:hover {
  background: #f8fafc;
}

.publish-card {
  background: white;
  border-radius: 24px;
  border: 1px solid #e2e8f0;
  margin-bottom: 2rem;
  overflow: hidden;
}

.publish-header {
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f8fafc;
}

.icon-circle {
  width: 48px;
  height: 48px;
  background: #e0e7ff;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4f46e5;
}

.publish-header h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.publish-header p {
  font-size: 0.75rem;
  color: #64748b;
}

.btn-toggle-form {
  margin-left: auto;
  padding: 0.5rem 1rem;
  background: #4f46e5;
  border: none;
  border-radius: 40px;
  color: white;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
}

.job-form {
  padding: 1.25rem;
  border-top: 1px solid #e2e8f0;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 0.25rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

.btn-submit {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  border: none;
  border-radius: 40px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
}

.employer-card {
  position: relative;
}

.job-status {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 0.65rem;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
}

.job-status.active {
  background: #dcfce7;
  color: #166534;
}

.job-status.closed {
  background: #fee2e2;
  color: #991b1b;
}

.employer-footer {
  justify-content: flex-end;
}

.btn-toggle {
  padding: 0.5rem 1rem;
  background: #ef4444;
  border: none;
  border-radius: 40px;
  color: white;
  font-size: 0.75rem;
  cursor: pointer;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 24px;
  border: 1px solid #e2e8f0;
}

.empty-state.small {
  padding: 1.5rem;
}

.empty-icon {
  margin-bottom: 1rem;
  color: #94a3b8;
}

.empty-state h4 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.empty-state p {
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 1rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content,
.chat-modal {
  background: white;
  border-radius: 32px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: auto;
}

.modal-header {
  padding: 1.25rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.company-badge {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
  color: #4f46e5;
}

.modal-title h2 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.modal-title p {
  font-size: 0.75rem;
  color: #64748b;
}

.modal-close {
  margin-left: auto;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #94a3b8;
}

.modal-body {
  padding: 1.25rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #475569;
}

.modal-description h4 {
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.modal-description p {
  font-size: 0.8rem;
  color: #475569;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.btn-primary {
  flex: 1;
  padding: 0.75rem;
  background: #4f46e5;
  border: none;
  border-radius: 40px;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.chat-modal {
  max-width: 400px;
  height: 600px;
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.chat-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #4f46e5;
}

.chat-header-info h3 {
  font-size: 0.9rem;
  font-weight: 600;
}

.chat-header-info p {
  font-size: 0.65rem;
  color: #10b981;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.message {
  display: flex;
  flex-direction: column;
  max-width: 80%;
}

.message.sent {
  align-self: flex-end;
}

.message.received {
  align-self: flex-start;
}

.message-bubble {
  padding: 0.6rem 1rem;
  border-radius: 20px;
  background: #f1f5f9;
  color: #1e293b;
}

.message.sent .message-bubble {
  background: #4f46e5;
  color: white;
}

.message .time {
  font-size: 0.6rem;
  color: #94a3b8;
  margin-top: 0.25rem;
  margin-left: 0.5rem;
}

.chat-input {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
}

.chat-input input {
  flex: 1;
  padding: 0.6rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 40px;
  font-size: 0.85rem;
}

.chat-input input:focus {
  outline: none;
  border-color: #4f46e5;
}

.chat-input button {
  width: 40px;
  height: 40px;
  background: #4f46e5;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.chat-input button:hover {
  background: #4338ca;
}

.applications-section {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

/* Estilos para solicitudes recibidas */
.applications-received {
  margin-top: 1rem;
  border-top: 1px solid #e2e8f0;
  padding-top: 0.75rem;
}

.applications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem;
  background: #f8fafc;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #1e293b;
  transition: all 0.2s;
}

.applications-header:hover {
  background: #f1f5f9;
}

.applications-list {
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.application-item {
  background: #f8fafc;
  border-radius: 16px;
  padding: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.application-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.candidate-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #4f46e5;
}

.candidate-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.candidate-details strong {
  font-size: 0.85rem;
  color: #0f172a;
}

.applied-date {
  font-size: 0.7rem;
  color: #64748b;
}

.app-status {
  font-size: 0.65rem;
  padding: 0.15rem 0.5rem;
  border-radius: 20px;
  width: fit-content;
}

.app-status.pending {
  background: #fef3c7;
  color: #d97706;
}

.app-status.accepted {
  background: #dcfce7;
  color: #166534;
}

.app-status.rejected {
  background: #fee2e2;
  color: #991b1b;
}

.application-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-view-profile {
  padding: 0.35rem 0.75rem;
  background: #e0e7ff;
  border: none;
  border-radius: 20px;
  font-size: 0.7rem;
  cursor: pointer;
  color: #4f46e5;
  transition: all 0.2s;
}

.btn-view-profile:hover {
  background: #c7d2fe;
}

.btn-chat-small {
  padding: 0.35rem 0.75rem;
  background: #4f46e5;
  border: none;
  border-radius: 20px;
  font-size: 0.7rem;
  cursor: pointer;
  color: white;
  transition: all 0.2s;
}

.btn-chat-small:hover {
  background: #4338ca;
}

.btn-accept {
  padding: 0.35rem 0.75rem;
  background: #10b981;
  border: none;
  border-radius: 20px;
  font-size: 0.7rem;
  cursor: pointer;
  color: white;
  transition: all 0.2s;
}

.btn-accept:hover {
  background: #059669;
}

.btn-reject {
  padding: 0.35rem 0.75rem;
  background: #ef4444;
  border: none;
  border-radius: 20px;
  font-size: 0.7rem;
  cursor: pointer;
  color: white;
  transition: all 0.2s;
}

.btn-reject:hover {
  background: #dc2626;
}

.accepted-badge, .rejected-badge {
  font-size: 0.7rem;
  padding: 0.25rem 0.6rem;
  border-radius: 20px;
}

.accepted-badge {
  background: #dcfce7;
  color: #166534;
}

.rejected-badge {
  background: #fee2e2;
  color: #991b1b;
}

.no-applications {
  text-align: center;
  padding: 1rem;
  color: #94a3b8;
  font-size: 0.75rem;
}

.candidate-profile-modal {
  max-width: 500px;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.skill-tag {
  background: #e0e7ff;
  color: #4f46e5;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.7rem;
}

.info-section {
  margin-bottom: 1.25rem;
}

.info-section h4 {
  font-size: 0.8rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
  padding-bottom: 0.25rem;
  border-bottom: 1px solid #e2e8f0;
}

.info-section p {
  font-size: 0.8rem;
  color: #475569;
  margin: 0.25rem 0;
}

.no-data {
  color: #94a3b8;
  font-style: italic;
  font-size: 0.75rem;
}

@media (max-width: 640px) {
  .header-content {
    padding: 0.75rem 1rem;
  }
  
  .main {
    padding: 1rem;
  }
  
  .filter-chips {
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 0.5rem;
  }
  
  .filter-actions {
    width: 100%;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-content, .chat-modal {
    width: 95%;
    margin: 0.5rem;
  }
  
  .user-name {
    display: none;
  }
  
  .nav-link span {
    display: none;
  }
  
  .btn-cancel, .btn-chat, .btn-outline {
    flex: 1;
    justify-content: center;
  }
  
  .application-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .application-actions {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>