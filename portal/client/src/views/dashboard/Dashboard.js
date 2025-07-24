import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import axios from '../../utils/axiosInstance' // Assuming axios instance is set up

import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCol,
  CProgress,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload } from '@coreui/icons'

const Dashboard = () => {
  const [summaryStats, setSummaryStats] = useState({
    totalFiles: 0,
    totalFilesProcessed: 0,
    totalFilesNotProcessedYet: 0,
    totalFilesConverted: 0,
    totalFilesToBeConverted: 0,
  })

  useEffect(() => {
    const fetchSummaryStats = async () => {
      try {
        const token = localStorage.getItem('authToken') // Get the token
        const headers = { Authorization: `Bearer ${token}` }

        const { data } = await axios.get(`/statistic/yearlySummaryStats?specificYear=2024`, {
          headers,
        })

        setSummaryStats(data)
      } catch (error) {
        console.error('Error fetching summary statistics:', error.response?.data || error.message)
      }
    }

    fetchSummaryStats()
  }, [])

  // Helper function to safely calculate percentage with up to 2 decimal places
  const calculatePercentage = (value, total) => {
    return total > 0 ? parseFloat(((value / total) * 100).toFixed(2)) : 0
  }

  const progressofQueues = [
    {
      title: 'Metric 1',
      value: summaryStats.totalFiles,
      percent: calculatePercentage(85, 100),
      color: 'success',
    },
    {
      title: 'Metric 2',
      value: summaryStats.totalFilesProcessed,
      percent: calculatePercentage(90, 120),
      color: 'info',
    },
    {
      title: 'Metric 3',
      value: summaryStats.totalFilesNotProcessedYet,
      percent: calculatePercentage(75, 205),
      color: 'warning',
    },
    {
      title: 'Metrıc 4',
      value: summaryStats.totalFilesConverted,
      percent: calculatePercentage(20, 100),
      color: 'danger',
    },
    {
      title: 'Metrıc 5',
      value: summaryStats.totalFilesToBeConverted,
      percent: calculatePercentage(88, 100),
      color: 'primary',
    },
  ]

  return (
    <>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Traffic
              </h4>
              <div className="small text-body-secondary">January - December 2025</div>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <CButton color="primary" className="float-end">
                <CIcon icon={cilCloudDownload} />
              </CButton>
              <CButtonGroup className="float-end me-3">
                {['Day', 'Month', 'Year'].map((value) => (
                  <CButton
                    color="outline-secondary"
                    key={value}
                    className="mx-0"
                    active={value === 'Month'}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCol>
          </CRow>
        </CCardBody>
        <CCardFooter>
          <CRow
            xs={{ cols: 1, gutter: 4 }}
            sm={{ cols: 2 }}
            lg={{ cols: 4 }}
            xl={{ cols: 5 }}
            className="mb-2 text-center"
          >
            {progressofQueues.map((item, index, items) => (
              <CCol
                className={classNames({
                  'd-none d-xl-block': index + 1 === items.length,
                })}
                key={index}
              >
                <div className="text-body-secondary">{item.title}</div>
                <div className="fw-semibold text-truncate">
                  {item.value} ({item.percent}%)
                </div>
                <CProgress thin className="mt-2" color={item.color} value={item.percent} />
              </CCol>
            ))}
          </CRow>
        </CCardFooter>
      </CCard>
    </>
  )
}

export default Dashboard
