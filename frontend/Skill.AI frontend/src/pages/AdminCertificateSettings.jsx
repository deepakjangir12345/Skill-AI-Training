import { useEffect, useState } from 'react'
import api from '../utils/api'
import './AdminCertificateSettings.css'

const initialSettings = {
  certificateTitle: '', organizationName: '', subtitle: '', signatureName: '',
  signatureDesignation: '', logoUrl: '', signatureImageUrl: '', templateName: '',
}

const AdminCertificateSettings = () => {
  const [settings, setSettings] = useState(initialSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState('')
  const [message, setMessage] = useState('')
  

  useEffect(() => {
    api.get('/admin/certificate-settings')
      .then((response) => setSettings({ ...initialSettings, ...response.data.settings }))
      .catch((error) => setMessage(error.response?.data?.message || 'Unable to load settings.'))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (event) => setSettings({ ...settings, [event.target.name]: event.target.value })

  const uploadAsset = async (event, field) => {
    const file = event.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('image', file)
    try {
      setUploading(field)
      const response = await api.post('/upload/certificate-asset', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const nextSettings = { ...settings, [field]: response.data.url }
      setSettings(nextSettings)
      await api.put('/admin/certificate-settings', nextSettings)
      setMessage('Asset uploaded and settings saved.')
    } catch (error) {
      setMessage(error.response?.data?.message || 'Asset upload failed.')
    } finally {
      setUploading('')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      setSaving(true)
      const response = await api.put('/admin/certificate-settings', settings)
      setSettings({ ...initialSettings, ...response.data.settings })
      setMessage('Certificate settings saved.')
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to save settings.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="admin-settings-page"><p>Loading settings...</p></div>

  return (
    <div className="admin-settings-page">
      <h1>Certificate Settings</h1>
      <p>Customize certificates generated from this point forward.</p>
      <form onSubmit={handleSubmit}>
        {[
          ['certificateTitle', 'Certificate Title'],
          ['organizationName', 'Organization / Platform Name'],
          ['subtitle', 'Certificate Subtitle'],
          ['signatureName', 'Authorized Signature Name'],
          ['signatureDesignation', 'Signature Designation'],
          ['templateName', 'Template / Theme Name'],
        ].map(([name, label]) => (
          <label key={name}>{label}<input name={name} value={settings[name]} onChange={handleChange} /></label>
        ))}
        <label>Certificate Logo URL<input name="logoUrl" value={settings.logoUrl} onChange={handleChange} />{settings.logoUrl && <img className="certificate-asset-preview" src={settings.logoUrl} alt="Certificate logo preview" />}</label>
        <label>Upload Logo<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => uploadAsset(event, 'logoUrl')} disabled={Boolean(uploading)} />{uploading === 'logoUrl' && <small>Uploading logo...</small>}</label>
        <label>Signature Image URL<input name="signatureImageUrl" value={settings.signatureImageUrl} onChange={handleChange} />{settings.signatureImageUrl && <img className="certificate-asset-preview signature-preview" src={settings.signatureImageUrl} alt="Signature preview" />}</label>
        <label>Upload Signature Image<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => uploadAsset(event, 'signatureImageUrl')} disabled={Boolean(uploading)} />{uploading === 'signatureImageUrl' && <small>Uploading signature...</small>}</label>
        <button type="submit" disabled={saving || Boolean(uploading)}>{saving ? 'Saving...' : 'Save Settings'}</button>
      </form>
      {message && <p className="admin-settings-message">{message}</p>}
    </div>
  )
}

export default AdminCertificateSettings
